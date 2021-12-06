'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TransportationSchema extends Schema {
	up () {
		this.create('transportations', (table) => {
		table.increments()
		table.timestamps()
		table.datetime('date')
		table.integer('lead_id').unsigned().index()
		})
	}

	down () {
		this.drop('transportations')
	}
}

module.exports = TransportationSchema
