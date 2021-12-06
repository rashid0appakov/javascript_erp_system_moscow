'use strict'
const CustomerContact = use('App/Models/CustomerContact')
class CustomerContactController {
	async store ({ request }) {
		const data = request.only(['role', 'name', 'phone', 'email', 'customer_id'])
		return await CustomerContact.create(data)
	}
	async update ({ params, request }) {
		const item = await CustomerContact.findOrFail(params.id)
		const data = request.only(['role', 'name', 'phone', 'email'])
		item.merge(data)
		await item.save()
	}
	async destroy ({ params }) {
		const item = await CustomerContact.findOrFail(params.id)
		await item.delete()
	}
}

module.exports = CustomerContactController
