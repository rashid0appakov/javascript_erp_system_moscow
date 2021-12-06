'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BoardSchema extends Schema {
	up () {
		this.create('boards', (table) => {
		table.increments()
		table.string('name', 64)
		table.text('settings')
		table.boolean('default').defaultTo(0)
		table.string('color', 32).defaultTo()
		table.integer('sort').unsigned().defaultTo(0)
		table.boolean('isDefault').defaultTo(0)
		table.integer('departament_id').unsigned().index()
		})
	}

	down () {
		this.drop('boards')
	}
}

module.exports = BoardSchema
