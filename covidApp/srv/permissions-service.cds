using covidcheck as covidcheck from '../db/entrypermission-model';

service PermissionsService {
    
    entity Permissions as projection on covidcheck.Permissions;
}
