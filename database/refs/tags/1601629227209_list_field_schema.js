'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ListFieldSchema extends Schema {
  up () {
    this.create('list_fields', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('list_fields')
  }
}

module.exports = ListFieldSchema
