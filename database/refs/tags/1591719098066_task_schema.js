'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TaskSchema extends Schema {
	up () {
		this.create('tasks', (table) => {
			table.increments()
			table.timestamps()
			table.datetime('notify_at').nullable()
			table.string('color', 32).default('#999999')
			table.boolean('active').default(1)
			table.text('body').nullable()
			table.integer('user_id').unsigned().index()
			table.integer('to_user_id').unsigned().index().nullable()
			table.integer('lead_id').unsigned().index()
		})
	}
	down () {
		this.drop('tasks')
	}
}

module.exports = TaskSchema
