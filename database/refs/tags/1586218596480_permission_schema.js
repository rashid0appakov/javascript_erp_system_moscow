'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PermissionSchema extends Schema {
	up() {
		this.create('permissions', (table) => {
		table.increments()
		table.string('name', 64).unique()
		table.string('rule', 64).unique()
		})
	}

	down() {
		this.drop('permissions')
	}
}

module.exports = PermissionSchema
