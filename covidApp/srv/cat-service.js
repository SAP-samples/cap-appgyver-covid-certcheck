const cds = require("@sap/cds");
const crypto = require("crypto");
const CovidCertificateVerifier = require('./lib/CovidCertificateVerifier.js')
const CertificateVerificationException = require('./lib/CertificateVerificationException.js')


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
    await persistValidationResult(req, result, endDate)
    return endDate.toString()
  })

  this.on("getAvailableCountries", async req => {
    return global.verifier.availableCountries
  })

  this.on("testGraphService", async req => {
    const graphMicroService = await cds.connect.to('GraphService')
    let result = graphMicroService.get('/getEmployeeData?firstName=Maximilian&lastName=Streifeneder')
    return "läuft"
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
  const empId = req.req.authInfo.getLogonName()
  const tx = cds.tx(req)
  let dbResult

  let existingPermission = await tx.run(SELECT.one.from(Permissions).where({ employeeID: empId }))
  try {
    if (!existingPermission) {
      dbResult = await tx.run(INSERT.into(Permissions).entries({
        employeeID: empId,
        firstName: result.nam.gn,
        lastName: result.nam.fn,
        permissionUntil: endDate
      }))
      console.log(`new permission for ${empId} until ${endDate}`)
    } else {
      dbResult = await tx.run(UPDATE(Permissions).set({ permissionUntil: endDate }).where({ employeeID: empId }))
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

async function checkValidityEnd(req) {
  let checkDate = new Date()
  let isValid = true

  do {
    checkDate = addDays(checkDate, 1)
    try {
      await global.verifier.checkCertificate(req.data.certificateString, 'DE', checkDate, false)
    } catch (error) {
      return subDays(checkDate, 1).toISOString().substring(0, 10)
    }

  } while (isValid);
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


