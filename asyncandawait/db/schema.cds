namespace asyncandawait.db;

entity PurchaseOrders {
  key ID          : UUID;
      PuchaseId   : String(50);
      status      : String(20);
}

entity ApprovalStatus {
  key ID          : UUID; 
      OrderId     : String;
      status      : String(20);  
}

