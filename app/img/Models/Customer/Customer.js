'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Customer extends Model {
    contacts(){
        return this.hasMany('App/Models/CustomerContact')
    }
    leads(){
        return this.hasMany('App/Models/Lead')
    }
    addresses(){
        return this.hasMany('App/Models/CustomerAddress')
    }
    customer_type(){
        return this.belongsTo('App/Models/CustomerType')
    }
}

module.exports = Customer
