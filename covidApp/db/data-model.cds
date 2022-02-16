using { Currency, managed, sap } from '@sap/cds/common';
namespace bookshop;

entity Books : managed {
  key ID : Integer;
  title  : String;
  stock  : Integer;
}

entity Authors : managed {
  key ID : Integer;
  name   : String(111);
  dateOfBirth  : Date;
  dateOfDeath  : Date;
  placeOfBirth : String;
  placeOfDeath : String;
}