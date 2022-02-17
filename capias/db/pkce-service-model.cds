using { managed, sap } from '@sap/cds/common';
namespace pkce_svc;

entity pkce_code : managed {
    key code : UUID;
    code_challenge : String(32);
    code_verifier : String(32);
}