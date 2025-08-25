using { API_BUSINESS_PARTNER as Business } from './API_BUSINESS_PARTNER';

namespace Thirdpartyintergration.srv.external;

entity businesspartner as projection on Business.A_BusinessPartner{
    key BusinessPartnerUUID,
    Customer,
    BirthDate,
    BusinessPartnerGrouping,
    BusinessPartnerFullName,
    BusinessPartnerCategory,
    BusinessPartnerOccupation
};


