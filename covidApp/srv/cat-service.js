const cds = require("@sap/cds");
const crypto = require("crypto");
const CovidCertificateVerifier = require('./lib/CovidCertificateVerifier.js')
const CertificateVerificationException = require('./lib/CertificateVerificationException.js')
const { useOrFetchDestination } = require("@sap-cloud-sdk/connectivity");
const { executeHttpRequest } = require("@sap-cloud-sdk/http-client");


module.exports = cds.service.impl(async function () {

  cds.once('served', async () => {
    if (!global.verifier) {
      global.verifier = new CovidCertificateVerifier()
      await global.verifier.init()
    }
  })

  this.on(["READ"], "Books", async (req) => {
    if (req.user.is("admin")) {
      return await SELECT.one("Books").where({ ID: 1 });
    } else {
      return await SELECT.one("Books").where({ ID: 2 });
    }
  });
  this.on(["READ"], "GenPkce", () => {
    let verifier = base64URLEncode(crypto.randomBytes(32));
    let challenge = base64URLEncode(sha256(verifier));
    return { code_challenge: challenge, code_verifier: verifier };
  });

  this.on("decodeCertificateString", async req => {
    let returnValue = {
      validUntil: new String()
    }
    try {
      result = await global.verifier.checkCertificate(req.data.certificateString, 'DE', new Date(), true)
    } catch (error) {
      if (error instanceof CertificateVerificationException) {
        req.error({
          code: 'FUNCTIONALERROR',
          message: error.toString(),
          target: 'certificateString',
          status: 418
        })
      } else {
        req.error({
          code: 'TECHNICALERROR',
          message: error.toString(),
          target: 'certificateString',
          status: 419
        })

      }
      return
    }
    let endDate = await checkValidityEnd(req)
    returnValue.validUntil = endDate
    await persistValidationResult(req, result, endDate)
    return JSON.stringify(returnValue)
  })

  this.on("getAvailableCountries", async req => {
    return global.verifier.availableCountries
  })

  this.on("testGraphService", async req => {
    let result = getSFSFDetails('Maximilian', 'Streifeneder', req)
    return JSON.stringify(result.data)
  })


});

function base64URLEncode(str) {
  return str
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

async function persistValidationResult(req, result, endDate) {
  const { Permissions } = cds.entities('covidcheck')
  let firstName = result.nam.gn
  let lastName = result.nam.fn
  const empId = req.req.authInfo.getLogonName()
  const tx = cds.tx(req)
  let dbResult, dateOfBirth, location, isContingentWorker, countryOfCompany

  try {
    ({ dateOfBirth = null, location = null, isContingentWorker = null, countryOfCompany = null } = await getSFSFDetails(firstName, lastName, req))
  } catch (error) {
    console.error(`${firstName} ${lastName} - erroneous SFSF call`)
    console.error(error.response.data)
  }

  let existingPermission = await tx.run(SELECT.one.from(Permissions).where({ employeeID: empId }))
  try {
    if (!existingPermission) {
      dbResult = await tx.run(INSERT.into(Permissions).entries({
        employeeID: empId,
        firstName: firstName,
        lastName: lastName,
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
        permissionUntil: endDate,
        dateOfBirth: dateOfBirth,
        location: location,
        countryOfCompany: countryOfCompany,
        isContingentWorker: isContingentWorker
      }).where({ employeeID: empId }))
      console.log(`updated permission for ${empId} until ${endDate}`)
    }
  } catch (error) {
    console.log(error)
    req.error(error)
  }
}

function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest();
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

async function checkValidityEnd(req) {
  let checkDate = new Date()
  let isValid = true

  let countDays = 0

  do {
    checkDate = addDays(checkDate, 1)
    countDays++
    try {
      let result = await global.verifier.checkCertificate(req.data.certificateString, 'DE', checkDate, false)
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


