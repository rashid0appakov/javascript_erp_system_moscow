'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ListRowSchema extends Schema {
  up () {
    this.create('list_rows', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('list_rows')
  }
}

module.exports = ListRowSchema
