'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CustomerSchema extends Schema {
    up () {
        this.create('customers', (table) => {
            table.increments()
			table.timestamps()
            table.string('name', 255).unique()
            table.string('inn', 10).nullable()
            table.string('kpp', 9).nullable()
            table.string('bik', 9).nullable()
            table.string('rs', 20).nullable()
            table.string('ks', 20).nullable()
            table.string('bank', 255).nullable()
            table.string('address', 255).nullable()
            table.string('u_address', 255).nullable()
            table.string('additional_info', 255).nullable()
            table.string('phone', 255).nullable()
            table.string('email', 255).nullable()
            table.integer('customer_type_id', 255).nullable().unsigned().index()
            
        })
    }

    down () {
        this.drop('customers')
    }
}

module.exports = CustomerSchema
