using covidcheck as covidcheck from '../db/entrypermission-model';

service PermissionsService {
    @readonly
    entity Permissions as projection on covidcheck.Permissions;
}
