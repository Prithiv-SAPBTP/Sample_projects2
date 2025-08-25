using { asyncandawait.db } from '../db/schema';

service MyService {
    entity PurchaseOrders as projection on db.PurchaseOrders;
    entity ApprovalStatus as projection on db.ApprovalStatus;

    action Order(OrderId : String) returns ApprovalStatus;
}