'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserTeamSchema extends Schema {
	up () {
		this.create('user_team', (table) => {
			table.integer('user_id').unsigned().index()
			table.integer('team_id').unsigned().index()
		})
	}

	down () {
		this.drop('user_team')
	}
}

module.exports = UserTeamSchema
