'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DepartamentUserSchema extends Schema {
    up () {
		this.create('departament_user', (table) => {
			table.integer('user_id').unsigned().index()
			table.integer('departament_id').unsigned().index()
			table.string('access', '4').defaultTo('d')
		})
    }

	down () {
		this.drop('departament_user')
	}
}

module.exports = DepartamentUserSchema
