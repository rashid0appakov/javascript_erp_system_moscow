'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PaymentSchema extends Schema {
	up () {
		this.create('payments', (table) => {
			table.increments()
			table.timestamps()
			table.string('description')
			table.float('amount').unsigned()
			table.integer('order_id').unsigned().index().nullable()
		})
	}
	down () {
		this.drop('payments')
	}
}

module.exports = PaymentSchema
