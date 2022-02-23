class CertificateVerificationException extends Error {
    constructor(message) {
        super(message);
    }
}

module.exports = CertificateVerificationException