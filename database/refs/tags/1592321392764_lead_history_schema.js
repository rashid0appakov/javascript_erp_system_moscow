'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class LeadHistorySchema extends Schema {
	up () {
		this.create('lead_histories', (table) => {
			table.increments()
			table.timestamps()
			table.text('body').nullable()
			table.integer('lead_id').unsigned().index()
			table.integer('user_id').unsigned().index().nullable()
		})
	}

	down () {
		this.drop('lead_histories')
	}
}

module.exports = LeadHistorySchema
