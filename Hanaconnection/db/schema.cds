namespace Hanaconnection.db;

entity Books {
    key BookID : UUID;
    BookName : String;
    Auhtor : String;
    PublishDate : DateTime;
    Stock : Integer;
}

