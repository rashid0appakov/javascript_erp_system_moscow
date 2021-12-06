'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DepartamentRequestSchema extends Schema {
  up () {
    this.create('departament_requests', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('departament_requests')
  }
}

module.exports = DepartamentRequestSchema
