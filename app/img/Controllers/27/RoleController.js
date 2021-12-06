'use strict'
const Role = use( 'App/Models/Role' )
class RoleController {
	async index( { request, response, auth } ) {
		return await Role.query().with('permissions').fetch()
	}
	async store( { request } ) {
		const data = request.only(['name', 'color', 'salary', 'bonus'])
		const role = await Role.create(data)
		const permissions = request.input('permissions')
		if(permissions) await role.permissions().sync(permissions)
		return role
	}
	async update( { params, request } ) {
		const permissions = request.input('permissions')
		const data = request.only(['name', 'color', 'salary', 'bonus'])
		const role = await Role.findOrFail(params.id)
		role.merge(data)
		await role.save()
		if(permissions) await role.permissions().sync(permissions)
	}
	async destroy( { params } ) {
		if(params.id > 1){
			const role = await Role.findOrFail(params.id)
			await role.delete()
		}
	}
}
module.exports = RoleController