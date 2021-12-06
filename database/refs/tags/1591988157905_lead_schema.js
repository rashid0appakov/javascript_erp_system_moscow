'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class LeadSchema extends Schema {
    up () {
		this.create('leads', (table) => {
			table.increments()
			table.timestamps()
			table.boolean('active').defaultTo(1)
			table.float('price').defaultTo(0)
			table.integer('hasNodes').unsigned().defaultTo(0)
			table.integer('sort').unsigned().defaultTo(0)
			table.integer('user_id').nullable().unsigned().index()
			table.integer('customer_id').nullable().unsigned().index()
			table.integer('board_id').nullable().unsigned().index()
		})
    }

  	down () {
    	this.drop('leads')
  	}
}

module.exports = LeadSchema
