'use strict'
const Fund = use('App/Models/Fund')
const Event = use('Event')
class FundController {
	async store ({ request }) {
		const fund = await Fund.create( request.all() )
		Event.fire('update_lead', fund.lead_id)
	}
	async update ({ params, request }) {
		const fund = await Fund.findOrFail(params.id)
		fund.merge(request.all())
		await fund.save()
		Event.fire('update_lead', fund.lead_id)
	}
	async destroy ({ params }) {
		const fund = await Fund.findOrFail(params.id)
		await fund.delete()
		Event.fire('update_lead', fund.lead_id)
	}
}

module.exports = FundController
