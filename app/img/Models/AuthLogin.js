'use strict'

class AuthLogin {
	get rules() {
		return { email: 'required|email', password: 'required' }
	}
	get messages() {
		return {
			'password.required': 'Обязательное поле',
			'email.required': 'Обязательное поле'
		}
	}
	get validateAll() {
		return true
	}
	async fails(errorMessages) {
		const errors = {}
		errorMessages.forEach(mess => { errors[mess.field] = mess.message})
		return this.ctx.response.status(422).json({errors})
	}
}

module.exports = AuthLogin
