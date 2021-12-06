'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Role extends Model {
	static boot() {
		super.boot();
		this.addTrait('NoTimestamp')
	}
	permissions() {
		return this.belongsToMany('App/Models/Permission')
	}
}

module.exports = Role