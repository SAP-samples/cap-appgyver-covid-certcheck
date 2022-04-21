using covidcheck as covidcheck from '../db/entrypermission-model';


service PermissionsService @(requires : 'authenticated-user') {

    entity Permissions as projection on covidcheck.Permissions;
}
