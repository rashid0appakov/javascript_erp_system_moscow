'use strict'

const Type = use('App/Models/CustomerType')
class CustomerTypeController {
	async index ({ request, response, view }) {
		return await Type.all()
	}
	async store ({ request }) {
		return await Type.create(request.only('name'))
	}
	async update ({ params, request }) {
		const type = await Type.findOrFail(params.id)
		type.name = request.input('name')
		await type.save()
		return type
	}
	async destroy ({ params}) {
		const type = await Type.findOrFail(params.id)
		return await type.delete()
	}
}

module.exports = CustomerTypeController
