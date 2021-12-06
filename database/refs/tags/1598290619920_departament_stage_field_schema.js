'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DepartamentStageFieldSchema extends Schema {
  up () {
    this.create('departament_fields', (table) => {
      table.increments()
      table.timestamps()
      table.integer('departament_id').unsigned().index()
    })
  }

  down () {
    this.drop('departament_fields')
  }
}

module.exports = DepartamentStageFieldSchema
