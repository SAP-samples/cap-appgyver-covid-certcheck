using PermissionsService as service from '../../srv/permissions-service';

annotate service.Permissions with @(UI.LineItem : [
    {
        $Type : 'UI.DataField',
        Label : 'First Name',
        Value : firstName,
    },
    {
        $Type : 'UI.DataField',
        Label : 'Last Name',
        Value : lastName,
    },
    {
        $Type : 'UI.DataField',
        Label : 'Valid Until',
        Value : permissionUntil,
    },
    {
        $Type : 'UI.DataField',
        Label : 'Date of Birth',
        Value : dateOfBirth,
    },
    {
        $Type : 'UI.DataField',
        Label : 'Location',
        Value : location,
    },
    {
        $Type : 'UI.DataField',
        Label : 'Country',
        Value : countryOfCompany,
    },
    {
        $Type : 'UI.DataField',
        Label : 'Contingent Worker?',
        Value : isContingentWorker,
    },
    {
        $Type : 'UI.DataField',
        Label : 'Created at',
        Value : createdAt,
    },
    {
        $Type : 'UI.DataField',
        Label : 'Updated at',
        Value : modifiedAt,
    }
]);

annotate service.Permissions with @(
    UI.FieldGroup #GeneratedGroup1 : {
        $Type : 'UI.FieldGroupType',
        Data  : [
            {
                $Type : 'UI.DataField',
                Label : 'ID',
                Value : employeeID,
            },
            {
                $Type : 'UI.DataField',
                Label : 'First Name',
                Value : firstName,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Last Name',
                Value : lastName,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Date of Birth',
                Value : dateOfBirth,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Location',
                Value : location,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Country',
                Value : countryOfCompany,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Contingent Worker?',
                Value : isContingentWorker,
            }
        ],
    },
    UI.FieldGroup #PermissionGroup : {
        $Type : 'UI.FieldGroupType',
        Data  : [
            {
                $Type : 'UI.DataField',
                Label : 'Valid Until',
                Value : permissionUntil,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Created at',
                Value : createdAt,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Updated at',
                Value : modifiedAt,
            }
        ],
    },
    UI.Facets                      : [
        {
            $Type  : 'UI.ReferenceFacet',
            ID     : 'GeneratedFacet1',
            Label  : 'Employee Information',
            Target : '@UI.FieldGroup#GeneratedGroup1',
        },
        {
            $Type  : 'UI.ReferenceFacet',
            ID     : 'CertificateFacet',
            Label  : 'PermissionDetails',
            Target : '@UI.FieldGroup#PermissionGroup',
        }
    ]
);
