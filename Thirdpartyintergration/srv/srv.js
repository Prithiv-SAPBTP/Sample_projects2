const cds = require('@sap/cds');

module.exports=async function (){
    const s4bpa =  await cds.connect.to('API_BUSINESS_PARTNER')

    this.on('READ','Customer',(req)=>{

        return s4bpa.run(req.query)
    })
}