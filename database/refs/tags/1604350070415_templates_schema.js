'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TemplatesSchema extends Schema {
  up () {
    this.create('templates', (table) => {
      table.increments()
      table.timestamps()
      table.text('body')
      table.string('name', 255)
    })
  }

  down () {
    this.drop('templates')
  }
}

module.exports = TemplatesSchema
