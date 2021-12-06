'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class LeadSourceSchema extends Schema {
  up () {
    this.create('lead_sources', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('lead_sources')
  }
}

module.exports = LeadSourceSchema
