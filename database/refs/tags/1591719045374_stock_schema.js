'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StockSchema extends Schema {
	up () {
		this.create('stocks', (table) => {
			table.increments()
			table.timestamps()
			table.string('name', 255)
		})
	}
	down () {
		this.drop('stocks')
	}
}

module.exports = StockSchema
