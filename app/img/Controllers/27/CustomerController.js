'use strict'
const Customer = use('App/Models/Customer')
const Helpers = use('Helpers')
const Drive = use('Drive')
const Excel   = require('exceljs')
class CustomerController {
	async index ({ request }) {
		const filter = request.all()
		const query = Customer.query().with('contacts').with('addresses').with('customer_type').with('leads')
		if(filter.q) query.where('name', 'like', '%'+filter.q+'%')
		return await query.fetch()
	}
	async store ({ request }) {
		const data = request.only(['name', 'phone', 'email', 'inn', 'kpp', 'bik', 'rs', 'ks', 'bank', 'address', 'u_address', 'customer_type_id'])
		const customer = await Customer.create(data)
		customer.addresses = []
		customer.contacts = []
		await customer.load('customer_type')
		return customer
	}
	async update ({ params, request }) {
		const customer = await Customer.findOrFail(params.id)
		const data = request.only(['name', 'phone', 'email', 'inn', 'kpp', 'bik', 'rs', 'ks', 'bank', 'address', 'u_address', 'customer_type_id'])
		customer.merge(data)
		await customer.save()
	}
	async destroy ({ params }) {
		const customer = await Customer.findOrFail(params.id)
		await customer.delete()
	}
	async destroyMany({request}){
		return await Customer.query().whereIn('id', request.input('ids')).delete()
	}
	async leads({params}){
		const customer = await Customer.findOrFail(params.id)
		return await customer.leads().fetch()
	}
	async upload({request}){
		const files = request.file('files', {
			extnames: ['xls', 'xlsx']
		})
		const filelocation = Helpers.publicPath('uploads/customers/')
		const type = request.input('customer_type_id')
		let filename
		await files.moveAll(filelocation, (file) => {
			filename = `${new Date().getTime()}.${file.extname}`
			return { name: filename }
		})
		if (!files.movedAll()) {
			return files.errors()
		}
		const data = []
		let workbook = new Excel.Workbook()
		workbook = await workbook.xlsx.readFile(filelocation + '/' + filename)
		workbook.worksheets[0].eachRow( (row, index) => {
			if(row.getCell(1).value != 'name' && row.getCell(1).value != ''){
				const obj = {
					name: row.getCell(1).value,
					inn: row.getCell(5).value,
					kpp: row.getCell(6).value,
					bik: row.getCell(7).value,
					rs: row.getCell(8).value,
					ks: row.getCell(9).value,
					bank: row.getCell(10).value,
					address: row.getCell(11).value,
					u_address: row.getCell(12).value,
					additional_info: row.getCell(13).value,
					contact: {
						name: row.getCell(2).value,
						phone: row.getCell(3).value,
						email: row.getCell(4).value
					}
				}

				if(type) obj.customer_type_id = type
				data.push(obj)
			}
		});
		await Drive.delete(filelocation + '/' + filename)
		for(let i = 0; i < data.length; i++){
			const item = data[i]
			const contact = item.contact
			delete item.contact
			const customer = await Customer.create(item)
			contact.customer_id = customer.id
			await customer.contacts().create(contact)
		}
		return await Customer.query().with('contacts').with('addresses').with('customer_type').with('leads').fetch()
	}
}

module.exports = CustomerController
