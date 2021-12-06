'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DepartamentSchema extends Schema {
	up () {
		this.create('departaments', (table) => {
			table.increments()
			table.string('icon', 32).nullable()
			table.string('name', 255)
			table.integer('parent_id').unsigned().index().nullable()
		})
	}
	down () {
		this.drop('departaments')
	}
}

module.exports = DepartamentSchema
