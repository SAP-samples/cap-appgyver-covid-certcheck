
const jsqr = require("jsqr")
const inkjet = require("inkjet")
const cds = require("@sap/cds");
const CovidCertificateVerifier = require('./lib/CovidCertificateVerifier.js')
const CertificateVerificationException = require('./lib/CertificateVerificationException.js')
const { useOrFetchDestination } = require("@sap-cloud-sdk/connectivity");
const { executeHttpRequest } = require("@sap-cloud-sdk/http-client");
const httpStatus = require('http-status-codes');
const sharp = require("sharp");
const { setLogLevel } = require('@sap-cloud-sdk/util')

const PNG = "i"
const JPEG = "/"


module.exports = cds.service.impl(async function () {

  cds.once('served', async () => {
    setDefaultCloudSdkLoggersLevel('error')
    if (!global.verifier) {
      global.verifier = new CovidCertificateVerifier()
      await global.verifier.init()
    }
  })

  this.on("decodeQrCode", async req => {
    let result, data, info, certificateString
    let image = req.data.base64String.split(",")[1]
    let imageBuffer = Buffer.from(
      image,
      "base64"
    );

    try {
      if (image.substring(0, 1) == JPEG) {
        inkjet.decode(imageBuffer, (err, decoded) => {
          let clampedArray = new Uint8ClampedArray(decoded.data);
          certificateString = jsqr(clampedArray, decoded.width, decoded.height).data;
        });
      } else if (image.substring(0, 1) == PNG) {
        //sharp + jsqr doesn't work for JPEG (always calculates width * height * 4 channel - doesn't work for jpeg and throws "malformed content...")
        ({ data, info } = await sharp(imageBuffer).raw().toBuffer({ resolveWithObject: true }));
        certificateString = jsqr(Uint8ClampedArray.from(data), info.width, info.height).data;
      } else {
        req.error({
          code: 'TECHNICALERROR',
          message: 'unsupported filetype. Only JPEG / PNG allowed.',
          target: 'certificateString',
          status: 419
        })
        return
      }

      console.log("result is: " + certificateString)
      result = await processCertificateString(req, certificateString, req.data.country)
    } catch (error) {
      console.error(error)
      req.error({
        code: 'TECHNICALERROR',
        message: 'QRCode cannot be parsed.',
        target: 'certificateString',
        status: 419
      })
      return
    }

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

  let existingPermission = await tx.run(SELECT.one.from(Permissions).where({ employeeID: empId, validForCountry: validForCountry }))
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
      }).where({ employeeID: empId, validForCountry: validForCountry }))
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
  const employeeLookupService = await cds.connect.to('EmployeeLookupService')
  firstName = encodeURI(firstName)
  lastName = encodeURI(lastName)
  const jwt = req.req.authInfo.getTokenInfo().getTokenValue()

  const destination = await useOrFetchDestination({
    destinationName: employeeLookupService.destination,
    jwt,
  });

  let result = await executeHttpRequest(
    { destinationName: employeeLookupService.destination, jwt },
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

  //first check for today - throws exception if not valid today
  let result = await global.verifier.checkRules(payload, country, checkDate, false)

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
  return (countDays > 400) ? true : false
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

function setDefaultCloudSdkLoggersLevel(level) {
  setLogLevel(level, "authorization-header");
  setLogLevel(level, "batch-response-transformer");
  setLogLevel(level, "destination-accessor-service");
  setLogLevel(level, "destination-accessor-vcap");
  setLogLevel(level, "env-destination-accessor");
  setLogLevel(level, "environment-accessor");
  setLogLevel(level, "http-client");
  setLogLevel(level, "proxy-util");
  setLogLevel(level, "response-data-accessor");
  setLogLevel(level, "xsuaa-service");
  setLogLevel(level, "jwt");
  setLogLevel(level, "register-destination");
  setLogLevel(level, "destination-selection-strategies");
  setLogLevel(level, "csrf-token-header");
  setLogLevel(level, "jwt");
}


