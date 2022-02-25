const cds = require("@sap/cds");
const crypto = require("crypto");
const CovidCertificateVerifier = require('../lib/CovidCertificateVerifier.js')
const CertificateVerificationException = require('../lib/CertificateVerificationException')


module.exports = cds.service.impl(function () {

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
      result = await global.verifier.checkCertificate(req.data.certificateString, 'DE', new Date())
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
        return
      }

    }

    let endDate = await checkValidityEnd(req)
    return 'valid until ' + endDate
  })
});

function base64URLEncode(str) {
  return str
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
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
      await global.verifier.checkCertificate(req.data.certificateString, 'DE', checkDate)
    } catch (error) {
      return subDays(checkDate, 1)
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


