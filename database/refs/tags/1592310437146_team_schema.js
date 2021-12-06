'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TeamSchema extends Schema {
	up () {
		this.create('teams', (table) => {
		table.increments()
		table.timestamps()
		table.string('name', 255)
		table.integer('departament_id').unsigned().index().nullable()
		})
	}

	down () {
		this.drop('teams')
	}
}

module.exports = TeamSchema
