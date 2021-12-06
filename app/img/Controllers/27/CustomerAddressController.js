'use strict'

const CustomerAddress = use('App/Models/CustomerAddress')
class CustomerAddressController {
	async store ({ request }) {
		const data = request.only(['name', 'address', 'customer_id'])
		return await CustomerAddress.create(data)
	}
	async update ({ params, request }) {
		const item = await CustomerAddress.findOrFail(params.id)
		const data = request.only(['name', 'address'])
		item.merge(data)
		await item.save()
	}
	async destroy ({ params }) {
		const item = await CustomerAddress.findOrFail(params.id)
		await item.delete()
	}
}

module.exports = CustomerAddressController
