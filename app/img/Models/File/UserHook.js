'use strict'
const Hash = use('Hash')
const Drive = use('Drive')
const Helpers = use('Helpers')
const UserHook = exports = module.exports = {}

UserHook.hashPassword = async (userInstance) => {
	if (userInstance.dirty.password) {
		userInstance.password = await Hash.make(userInstance.password)
	}
}
UserHook.removePhoto = async (userInstance) => {
	if (userInstance.photo) {
		await Drive.delete(Helpers.publicPath(userInstance.photo))
	}
}
