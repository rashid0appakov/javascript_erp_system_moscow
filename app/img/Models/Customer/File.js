'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class File extends Model {
    static boot() {
		super.boot()
		this.addHook('beforeDelete', 'FileHook.removeFile')
	}
}

module.exports = File
