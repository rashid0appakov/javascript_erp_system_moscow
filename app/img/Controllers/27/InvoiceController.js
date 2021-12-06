'use strict'
const Invoice = use('App/Models/Invoice')
const InvoiceRow = use('App/Models/InvoiceRow')
const Event = use('Event')
class InvoiceController {
	async index ({ request, response, view }) {
	}

	async store ({ request }) {
		const rows = request.only('rows')
		const data = request.except('rows')
		const invoice = await Invoice.create(data)
		console.log(rows)
		await invoice.rows().createMany(rows.rows)
		Event.fire('update_lead', invoice.lead_id)
	}
	async update ({ params, request }) {
		const invoice = await Invoice.findOrFail(params.id)
		const rows = request.only('rows')
		const data = request.except('rows')
		invoice.merge(data)
		await invoice.save()
		await InvoiceRow.query().where('invoice_id', invoice.id).delete()
		await invoice.rows().createMany(rows.rows)
		Event.fire('update_lead', invoice.lead_id)
	}
	async destroy ({ params, request, response }) {
	}
}

module.exports = InvoiceController
