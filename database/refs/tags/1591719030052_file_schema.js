'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FileSchema extends Schema {
	up () {
		this.create('files', (table) => {
			table.increments()
			table.timestamps()
			table.integer('fileable_id').unsigned().index()
			table.string('fileable_type', 255)
			table.string('group', 32)
			table.string('name', 255)
			table.string('path', 255)
			table.string('size', 16)
			table.string('type', 16)
		})
	}
	down () {
		this.drop('files')
	}
}

module.exports = FileSchema
