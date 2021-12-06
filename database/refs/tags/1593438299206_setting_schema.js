'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SettingSchema extends Schema {
	up () {
			this.create('settings', (table) => {
			table.string('key', 32).unique().index()
			table.string('value', 32)
		})
	}

	down () {
		this.drop('settings')
	}
}

module.exports = SettingSchema
