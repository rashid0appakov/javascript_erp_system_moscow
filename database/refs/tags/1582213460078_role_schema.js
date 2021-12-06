'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RoleSchema extends Schema {
	up() {
		this.create('roles', (table) => {
			table.increments()
			table.string('name', 64)
			table.double('salary').unsigned().defaultTo(0)
			table.string('color', 16).defaultTo('#999999')
		})
	}
	down() {
		this.drop('roles')
	}
}

module.exports = RoleSchema
