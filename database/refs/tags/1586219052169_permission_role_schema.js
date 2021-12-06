'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PermissionRoleSchema extends Schema {
	up() {
		this.create('permission_role', (table) => {
			table.integer('role_id').unsigned().index()
			table.integer('permission_id').unsigned().index()
		})
	}
	down() {
		this.drop('permission_role')
	}
}

module.exports = PermissionRoleSchema
