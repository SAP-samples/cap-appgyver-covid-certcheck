const cds = require("@sap/cds");
const crypto = require("crypto");
const CovidCertificateVerifier = require('../lib/CovidCertificateVerifier.js')


module.exports = cds.service.impl(function () {

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

  this.on("decodeCertificateString", req => {
    let verifier = new CovidCertificateVerifier()
    console.log("here's my string:")
    console.log(req.data)
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
