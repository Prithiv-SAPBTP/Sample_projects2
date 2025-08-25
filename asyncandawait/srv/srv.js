const cds = require("@sap/cds");
const { v4: uuidv4 } = require("uuid");

module.exports = (srv) => {
  const { PurchaseOrders, ApprovalStatus } = srv.entities;

  srv.before("Order",async (req) =>{
    let Order_id = req.data.OrderId;
    let Appr_id = uuidv4();
    let Statusvalue = req.data.status;

    await INSERT.into(ApprovalStatus).entries({
      orderID: Order_id,
      ID:Appr_id,
      status: Statusvalue,
    });

    // if (req.headers.prefer && req.headers.prefer.includes("respond-async")) {
    //   req.res
    //     .status(202)
    //     .set("ID", `/odata/v4/my/PurchaseOrders/Order(${Order_id})`)
    //     .send();
    // }
    req.data.ApprovalID = Appr_id;
  })

   srv.on("Order",async (req) =>{
    const { orderID , ApprovalID } = req.data;

    setTimeout(async () => {
      await UPDATE(ApprovalStatus, { ID: ApprovalID , OrderId : orderID }).with({
        status: "Completed",
      });

       await UPDATE(PurchaseOrders, { ID: orderID }).with({
        status: "Approved",
      });
    }, 30000);

    const result = await SELECT.one.from(ApprovalStatus).where({ ID: ApprovalID });
    return result;
    
    });

    srv.after("READ", ApprovalStatus, (val) => {
    if (val.status === "Pending") {
      val.message = "Approval is Pending...... please check later";
    }
  });
}