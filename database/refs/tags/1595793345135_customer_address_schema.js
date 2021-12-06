'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CustomerAddressSchema extends Schema {
  up () {
    this.create('customer_addresses', (table) => {
      table.increments()
      table.string('name', 255)
      table.string('addres', 255)
      table.integer('customer_id').unsigned().index()
    })
  }

  down () {
    this.drop('customer_addresses')
  }
}

module.exports = CustomerAddressSchema
