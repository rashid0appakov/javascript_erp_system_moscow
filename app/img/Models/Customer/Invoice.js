'use strict'

const Model = use('Model')

class Invoice extends Model {
    rows(){
        return this.hasMany('App/Models/InvoiceRow')
    }
}

module.exports = Invoice
