'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CustomerContactSchema extends Schema {
	up () {
			this.create('customer_contacts', (table) => {
			table.increments()
			table.timestamps()
			table.string('role', 255).nullable()
			table.string('name',255)
			table.string('phone', 32).nullable()
			table.string('email', 255).nullable()
			table.integer('customer_id').unsigned().index().notNullable()
		})
	}

	down () {
		this.drop('customer_contacts')
	}
}

module.exports = CustomerContactSchema
