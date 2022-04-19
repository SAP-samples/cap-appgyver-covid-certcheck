service VerificationService @(requires : 'authenticated-user') {

    action   decodeCertificateString(certificateString : String) returns String;
    action   decodeQrCode(base64String : String)                 returns String;
    function getAvailableCountries()                             returns array of String;
    function testGraphService()                                  returns String;
}
