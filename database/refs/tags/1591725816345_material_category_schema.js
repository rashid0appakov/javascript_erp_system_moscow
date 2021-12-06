'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MaterialCategorySchema extends Schema {
	up () {
		this.create('material_categories', (table) => {
			table.increments()
			table.string('name', 255)
			table.text('description')


			table.integer('parent_id').nullable().unsigned().index()
		})
	}
	down () {
		this.drop('material_categories')
	}
}

module.exports = MaterialCategorySchema
