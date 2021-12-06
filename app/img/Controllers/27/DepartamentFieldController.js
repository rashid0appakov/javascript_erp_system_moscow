'use strict'
const DepartamentField = use('App/Models/DepartamentField')
class DepartamentFieldController {
	async index ({ request, response, view }) {
	}
	async store ({ request }) {
		return await DepartamentField.create( request.all() )
	}
	async update ({ params, request }) {
		const field = await DepartamentField.findOrFail(params.id)
		field.merge(request.all())
		await field.save()
	}
	async destroy ({ params, request, response }) {
	}
}

module.exports = DepartamentFieldController
