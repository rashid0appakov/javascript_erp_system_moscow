'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BoardLeadSchema extends Schema {
  up () {
		this.create('board_lead', (table) => {
			table.integer('board_id').unsigned().index()
			table.integer('lead_id').unsigned().index()
			table.integer('departament_id').unsigned().index()
			table.timestamps()
		})
  }

	down () {
		this.drop('board_lead')
	}
}

module.exports = BoardLeadSchema
