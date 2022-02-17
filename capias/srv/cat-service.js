const cds = require("@sap/cds");
const crypto = require("crypto");

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
