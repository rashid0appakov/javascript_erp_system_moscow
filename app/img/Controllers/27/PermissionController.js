'use strict'

const Permission = use('App/Models/Permission')
class PermissionController {
	async index({ }) {
		const permissions = await Permission.all()
		return permissions
	}
	async store({ }) {}
	async destroy({ params }) {
		const item = await Permission.findOrFail(params.id)
		await item.delete()
	}
}

module.exports = PermissionController