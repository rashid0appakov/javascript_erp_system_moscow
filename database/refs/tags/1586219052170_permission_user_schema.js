'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PermissionUserSchema extends Schema {
	up () {
		this.create('permission_user', (table) => {
			table.integer('user_id').unsigned().index()
			table.integer('permission_id').unsigned().index()
		})
	}
	down () {
		this.drop('permission_user')
	}
}

module.exports = PermissionUserSchema
