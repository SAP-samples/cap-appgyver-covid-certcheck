using bookshop as bookshop from '../db/data-model';
using pkce_svc as pkce from '../db/pkce-service-model';

service AuthenticatedService @(requires : 'authenticated-user') {
    @readonly
    entity Books as projection on bookshop.Books;
}

service AdminService @(requires : 'admin') {
    @readonly
    entity Authors as projection on bookshop.Authors;
}

service PkceService @(_requires : 'authenticated-user') {
    view GenPkce as
        select from pkce.pkce_code {
            pkce_code.code_challenge as code_challenge,
            pkce_code.code_verifier  as code_verifier
        };
}

service VerificationService @(requires : 'authenticated-user') {

    action   decodeCertificateString(certificateString : String) returns String;
    action  decodeQrCode(base64String : String) returns String;
    function getAvailableCountries()                             returns array of String;
    function testGraphService()                                  returns String;
}
