using {
    managed,
    sap
} from '@sap/cds/common';

namespace covidcheck;

entity Permissions : managed {

    key employeeID         : String;
        firstName          : String;
        lastName           : String;
        dateOfBirth        : Date;
        location           : String;
        countryOfCompany   : String;
        isContingentWorker : Boolean;
        permissionUntil    : Date;
}
