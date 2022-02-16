
const cds = require('@sap/cds')

module.exports = cds.service.impl(function(){ 
    this.on(['READ'], 'Books', async (req)=>{
        if (req.user.is('admin')){
            return await SELECT.one('Books').where({ ID: 1})
        }else{
            return await SELECT.one('Books').where({ ID: 2})
        }
    })
 })