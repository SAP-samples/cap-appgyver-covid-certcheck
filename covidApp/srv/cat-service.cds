using bookshop as bookshop from '../db/data-model';

service AuthenticatedService @(requires:'authenticated-user') {
    @readonly entity Books as projection on bookshop.Books;
}

service AdminService @(requires:'admin') {
    @readonly entity Authors as projection on bookshop.Authors;
}