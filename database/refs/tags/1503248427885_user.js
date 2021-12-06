'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
	up() {
		this.create('users', (table) => {
			table.increments()
			table.boolean('active').defaultTo(1)
			table.string('name', 64)
			table.string('surname', 64)
			table.string('lastname', 64)
			table.string('photo', 64)
			table.string('phone', 16)
			table.string('email', 255).unique()
			table.string('password', 255)
			table.double('balance', 255).unsigned().defaultTo(0)
			table.timestamps()
			table.string('telegram_id', 64).nullable()
			table.timestamp('activity_at')
			table.integer('role_id').unsigned().index()
		})
	}
	down() {
		this.drop('users')
	}
}

module.exports = UserSchema
