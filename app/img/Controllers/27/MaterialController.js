'use strict'
const Material = use('App/Models/Material')
class MaterialController {
	async index ({ request, response, view }) {
		return await Material.query().with('category').fetch()
	}
	async store ({ request}) {
		const data = request.only(['material_category_id', 'name', 'weight', 'quantity', 'price'])
		const material = await Material.create(data)
		await material.load('category')
		return material
	}
	async update ({ params, request }) {
		const data = request.only(['material_category_id', 'name', 'weight', 'quantity', 'price'])
		const material = await Material.findOrFail(params.id)
		material.merge(data)
		await material.save()
		await material.load('category')
		return material
	}
	async destroyMany({request}){
		const ids = request.input('ids')
		return await Material.query().whereIn('id', ids).delete()
	}
}

module.exports = MaterialController
