'use strict'

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class User extends Model {
	static boot() {
		super.boot()
		this.addHook('beforeSave', 'UserHook.hashPassword')
		this.addHook('beforeDelete', 'UserHook.removePhoto')
	}
	static get hidden() {
		return ['password']
	}
	tokens() {
		return this.hasMany('App/Models/Token')
	}
	role() {
		return this.belongsTo('App/Models/Role')
	}
	files(){
		return this.hasMany('App/Models/File', 'id', 'fileable_id').where('fileable_type', 'users')
	}
	tasks(){
		return this.hasMany('App/Models/Task', 'id', 'to_user_id')
	}
	departaments(){
		return this.belongsToMany('App/Models/Departament').wherePivot('access', '>', 'd')
	}
	permissions(){
		return this.belongsToMany('App/Models/Permission')
	}
	notifications(){
		return this.hasMany('App/Models/Notification')
	}
}

module.exports = User
