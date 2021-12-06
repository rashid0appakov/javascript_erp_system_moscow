'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CUstomerTypeSchema extends Schema {
  up () {
    this.create('customer_types', (table) => {
      table.increments()
      table.string('name', 255)
    })
  }

  down () {
    this.drop('customer_types')
  }
}

module.exports = CUstomerTypeSchema
