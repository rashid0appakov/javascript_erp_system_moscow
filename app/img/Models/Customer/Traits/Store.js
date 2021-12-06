'use strict'

class Store {
	get rules() {
		return {
			name: 'required|string|min:3|max:64|unique:customers,name'
		}
	}
	get messages() {
		return {
			'name.unique': 'Этот имя уже используется',
			'name.required': 'Обязательное поле',
			'name.min': 'Не менее 3 символов',
			'name.max': 'Не более 64 символов'
		}
	}
	get validateAll() {
		return true
	}
	async fails(errorMessages) {
		return this.ctx.response.status(422).json(errorMessages)
	}
}

module.exports = Store