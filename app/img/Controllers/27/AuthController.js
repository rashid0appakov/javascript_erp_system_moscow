'use strict'
const User = use('App/Models/User');

class AuthController {
	async me({ request, auth, response }) {
		await auth.user.loadMany(['role', 'role.permissions', 'departaments', 'permissions']);
		return auth.user
	}
	async login({ request, auth, response }) {
		let { email, password } = request.all();
		try {
			let user = await User.findBy('email', email);
			if (!user) {
				return response.status(404).json({ danger: 'Пользователь не найден!' })
			}
			if (await auth.attempt(email, password)) {
				let token = await auth.generate(user)
				await user.loadMany(['role', 'role.permissions']);
				return response.json({ user, token: token.token })
			}
		} catch (e) {
			return response.status(401).json({ danger: 'Ошибка авторизации' })
		}
	}
}

module.exports = AuthController
