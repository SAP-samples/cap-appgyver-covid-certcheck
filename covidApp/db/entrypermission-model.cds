using {
    managed,
    sap
} from '@sap/cds/common';

namespace covidcheck;

entity Permissions : managed {

    key employeeID      : String;
        firstName       : String;
        lastName        : Integer;
        permissionUntil : Date;
}
