'use strict'
const Category = use('App/Models/MaterialCategory')
class MaterialCategoryController {
	async index ({ request, response, view }) {
		return await Category.all()
	}
	async store ({ request }) {
		const data = request.all()
		return await Category.create(data)
	}
	async update ({ params, request }) {
		const data = request.all()
		const category = await Category.findOrFail(params.id)
		category.merge(data)
		await category.save()
	}
	async destroy ({ params, request, response }) {
	}
}

module.exports = MaterialCategoryController
