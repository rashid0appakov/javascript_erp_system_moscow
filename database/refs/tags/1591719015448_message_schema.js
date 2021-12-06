'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MessageSchema extends Schema {
	up () {
		this.create('messages', (table) => {
			table.increments()
			table.text('body')
			table.string('username', 255)
			table.timestamps()
			table.string('messageable_type', 255)
			table.integer('messageable_id').unsigned().index().nullable()
			table.integer('user_id').unsigned().index().nullable()
		})
	}
	down () {
		this.drop('messages')
	}
}

module.exports = MessageSchema
