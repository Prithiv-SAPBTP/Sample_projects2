using { Hanaconnection.db } from '../db/schema';

service MyService {

    entity Books as projection on db.Books;

}
