'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ActionSchema extends Schema {
  up () {
		this.create('actions', (table) => {
		table.increments()
		table.timestamps()
		table.integer('user_id').unsigned().index()
		table.string('name', 255)
		})
  }

	down () {
		this.drop('actions')
	}
}

module.exports = ActionSchema
