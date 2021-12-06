'use strict'

class Store {
	get rules() {
		return {
			email: 'required|email|unique:users,email',
			password: 'required|string|min:6|max:64',
			name: 'required|string|min:3|max:64',
			role_id: 'required|integer',
			avatar: 'file|file_ext:png,jpg|file_size:2mb|file_types:image'
		}
	}
	get messages() {
		return {
			'password.required': 'Обязательное поле',
			'password.min': 'Не менее 6 символов',
			'password.max': 'Не более 64 символов',
			'email.required': 'Обязательное поле',
			'email.email': 'E-mail указан неверно',
			'email.unique': 'Этот e-mail уже используется',
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