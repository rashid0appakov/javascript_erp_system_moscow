'use strict'

const Template = use('App/Models/Template')
class TemplateController {
	async index () {
		return await Template.all()
	}
	async store ({ request }) {
		return await Template.create(request.only(['name', 'body', 'subject', 'usePaste']))
	}
	async update ({ params, request }) {
		const template = await Template.findOrFail(params.id)
		template.merge(request.only(['name', 'body', 'subject', 'usePaste']))
		return await template.save()
	}
	async destroy ({ params}) {
		const template = await Template.findOrFail(params.id)
		return await template.delete()
	}
}

module.exports = TemplateController
