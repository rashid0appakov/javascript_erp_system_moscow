'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class LeadNodeSchema extends Schema {
	up () {
		this.create('lead_nodes', (table) => {
			table.increments()
			table.timestamps()
			table.string('name', 32).nullable()
			table.string('number', 32).nullable()
			table.integer('quantity').unsigned().defaultTo(1)
			table.string('cut', 32).nullable()
			table.float('len').nullable()
			table.float('weight').nullable()
			table.float('weight_total').nullable()
			table.float('weight_element').nullable()
			table.string('mark', 32).nullable()
			table.string('description', 32).nullable()
			table.integer('user_id').unsigned().index().nullable()
			table.integer('lead_id').unsigned().index()
			table.integer('parent_id').unsigned().index().nullable()
			table.float('k').unsigned().defaultTo(1)
			table.integer('board_id').unsigned().index().nullable()
		})
	}

	down () {
		this.drop('lead_nodes')
	}
}

module.exports = LeadNodeSchema
