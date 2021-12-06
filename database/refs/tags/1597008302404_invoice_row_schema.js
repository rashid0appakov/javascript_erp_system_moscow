'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class InvoiceRowSchema extends Schema {
  up () {
    this.create('invoice_rows', (table) => {
      table.increments()
      table.interget('invoice_id').unsigned().index()
      table.string('name', 255)
      table.double('quantity').unsigned().defaultTo(1)
      table.string('val', 255)
      table.double('price').unsigned()
    })
  }

  down () {
    this.drop('invoice_rows')
  }
}

module.exports = InvoiceRowSchema
