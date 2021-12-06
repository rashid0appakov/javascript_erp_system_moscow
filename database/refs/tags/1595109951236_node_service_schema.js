'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class NodeServiceSchema extends Schema {
  up () {
    this.create('node_services', (table) => {
      table.increments()
      table.string('name', 255)
    })
  }

  down () {
    this.drop('node_services')
  }
}

module.exports = NodeServiceSchema
