'use strict'

class FileStore {
	get rules() {
		return {
			filable_id: 'required',
			fileable_type: 'required'
		}
	}
	get messages() {
		return {
			'fileable_type.required': 'Обязательное поле',
			'filable_id.required': 'Обязательное поле',
		}
	}
	get validateAll() {
		return true
	}
	async fails(errorMessages) {
		return this.ctx.response.status(422).json(errorMessages)
	}
}

module.exports = FileStore
