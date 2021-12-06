'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FundSchema extends Schema {
	up () {
		this.create('funds', (table) => {
			table.increments()
			table.timestamps()
			table.double('value').unsigned().defaultTo(0)
			table.integer('lead_id').unsigned().index()
			table.integer('departament_id').unsigned().index()
		})
	}

	down () {
		this.drop('funds')
	}
}

module.exports = FundSchema
