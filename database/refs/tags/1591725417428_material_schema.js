'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MaterialSchema extends Schema {
	up () {
		this.create('materials', (table) => {
			table.increments()
			table.string('name', 255)
			table.text('description').nullable()
			table.float('price').nullable().unsigned()
			table.float('quantity').unsigned().default(0)
			table.timestamps()

			table.integer('material_dimmention_id').unsigned().index()
			table.integer('stock_id').unsigned().index()
		})
	}
	down () {
		this.drop('materials')
	}
}

module.exports = MaterialSchema
