using { Thirdpartyintergration.srv.external as db } from './external/input';

namespace Thirdpartyintergration.srv;

service MyService {

    entity Customer as projection on db.businesspartner;

}

