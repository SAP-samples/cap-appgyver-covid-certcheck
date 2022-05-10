const Jimp = require("jimp");
const QrCode = require('qrcode-reader');
const cds = require("@sap/cds");
const CovidCertificateVerifier = require('./lib/CovidCertificateVerifier.js')
const CertificateVerificationException = require('./lib/CertificateVerificationException.js')
const { useOrFetchDestination } = require("@sap-cloud-sdk/connectivity");
const { executeHttpRequest } = require("@sap-cloud-sdk/http-client");
const httpStatus = require('http-status-codes');
const sharp = require("sharp");

module.exports = cds.service.impl(async function () {

  cds.once('served', async () => {
    if (!global.verifier) {
      global.verifier = new CovidCertificateVerifier()
      await global.verifier.init()
    }
  })

  this.on("decodeQrCode", async req => {
    let qrcodeDecodeValue;

    let imageBuffer = Buffer.from(
      req.data.base64String.split(",")[1],
      "base64"
    );
    const metadata = await sharp(imageBuffer)
      .resize({
        width: 562,
        height: 1216,
      })
      .toBuffer();

    let result = await new Promise((resolve, reject) => {
    

      Jimp.read(metadata, async (err, image) => {
        if (err) console.error(err)
        var qr = new QrCode();
        qr.callback = async (err, value) => {
          if (err) console.error(err)
          qrcodeDecodeValue = value.result;
          resolve(await processCertificateString(req, qrcodeDecodeValue, req.data.country))
        };
        qr.decode(image.bitmap);
      });
    });

    return result
  })

  this.on("decodeCertificateString", async req => {
    return await processCertificateString(req, req.data.certificateString, req.data.country)
  })

  this.on("getAvailableCountries", async req => {
    return global.verifier.availableCountries
  })

});

async function persistValidationResult(req, result, endDate, validForCountry) {
  const { Permissions } = cds.entities('covidcheck')
  let payload = result.get(global.verifier.PAYLOAD).get(1)
  let firstName = payload.nam.gn
  let lastName = payload.nam.fn
  const empId = req.req.authInfo.getLogonName()
  const tx = cds.tx(req)
  let dbResult, dateOfBirth, location, isContingentWorker, countryOfCompany, mimeType, photo

  try {
    ({ dateOfBirth = null, location = null, isContingentWorker = null, countryOfCompany = null, mimeType = null, photo = null } = await getSFSFDetails(firstName, lastName, req))
  } catch (error) {
    console.error(`${firstName} ${lastName} - erroneous SFSF call`)
    console.error(error.response.data)
    if (error.response.status == httpStatus.StatusCodes.FORBIDDEN) throw new CertificateVerificationException("You are not the owner of the certificate.")
  }

  let existingPermission = await tx.run(SELECT.one.from(Permissions).where({ employeeID: empId }))
  try {
    if (!existingPermission) {
      dbResult = await tx.run(INSERT.into(Permissions).entries({
        employeeID: empId,
        firstName: firstName,
        lastName: lastName,
        validForCountry: validForCountry,
        dateOfBirth: dateOfBirth,
        location: location,
        countryOfCompany: countryOfCompany,
        isContingentWorker: isContingentWorker,
        permissionUntil: endDate
      }))
      console.log(`new permission for ${empId} until ${endDate}`)
    } else {
      dbResult = await tx.run(UPDATE(Permissions).set({
        firstName: firstName,
        lastName: lastName,
        validForCountry: validForCountry,
        dateOfBirth: dateOfBirth,
        location: location,
        countryOfCompany: countryOfCompany,
        isContingentWorker: isContingentWorker,
        permissionUntil: endDate,
      }).where({ employeeID: empId }))
      console.log(`updated permission for ${empId} until ${endDate}`)
    }
  } catch (error) {
    console.log(error)
    req.error(error)
  }

  return {
    fullName: `${firstName} ${lastName}`,
    photo: photo,
    mimeType: mimeType
  }
}

async function getSFSFDetails(firstName, lastName, req) {
  const graphMicroService = await cds.connect.to('GraphService')
  firstName = encodeURI(firstName)
  lastName = encodeURI(lastName)
  const jwt = req.req.authInfo.getTokenInfo().getTokenValue()

  const destination = await useOrFetchDestination({
    destinationName: graphMicroService.destination,
    jwt,
  });

  let result = await executeHttpRequest(
    { destinationName: graphMicroService.destination, jwt },
    {
      headers: {
        accept: '*/*',
        client_id: destination.clientId,
        client_secret: destination.clientSecret,
      },
      method: 'GET',
      timeout: 60000,
      url: `${destination.url}/graph/getEmployeeData?firstName=${firstName}&lastName=${lastName}`,
    }
  );

  return result.data
}


async function checkValidityEnd(payload, country) {
  let checkDate = new Date()
  let isValid = true

  let countDays = 0

  do {
    checkDate = addDays(checkDate, 1)
    countDays++
    try {
      let result = await global.verifier.checkRules(payload, country, checkDate, false)
      //quick and dirty to avoid endless loop
      if (isValidInfinite(countDays)) {
        return new Date("9999-12-31").toISOString().substring(0, 10)
      }
    } catch (error) {
      return subDays(checkDate, 1).toISOString().substring(0, 10)
    }

  } while (isValid);
}

/*
The method to check how long a certificate is valid checks day by day if the certificate is still valid. 
In some countries, certificates (boosters, etc.) are valid unlimited period. 
We assume that if a certificate is valid for more than two years, the certificate 
is valid indefinitely. This avoids that the actual method continues to check day by day (infinite loop) 
whether the certificate is valid. 
**/
function isValidInfinite(countDays) {
  return (countDays > 700) ? true : false
}

function addDays(date, days) {
  var result = new Date(date)
  result.setDate(result.getDate() + days)
  return result;
}

function subDays(date, days) {
  var result = new Date(date)
  result.setDate(result.getDate() - days)
  return result;
}

async function processCertificateString(req, certificateString, checkForCountry) {
  let endDate
  let returnValue = {
    validUntil: new String(),
    name: new String(),
    message: 'Validation succesful',
    photo: new String(),
    status: 200
  }
  try {
    const payload = await global.verifier.checkCertificate(certificateString)
    endDate = await checkValidityEnd(payload, checkForCountry);
    let fullName, photo, mimeType;
    ({ fullName, photo, mimeType } = await persistValidationResult(req, payload, endDate, checkForCountry))
    returnValue.photo = `data:${mimeType};base64,${photo}`
    returnValue.name = fullName
    returnValue.validUntil = endDate
    returnValue.country = checkForCountry
  } catch (error) {
    if (error instanceof CertificateVerificationException) {
      req.error({
        code: 'FUNCTIONALERROR',
        message: error.toString(),
        target: 'certificateString',
        status: 418
      })
    } else {
      console.error(error.toString())
      req.error({
        code: 'TECHNICALERROR',
        message: error.toString(),
        target: 'certificateString',
        status: 419
      })

    }

    return
  }
  return JSON.stringify(returnValue)
}


