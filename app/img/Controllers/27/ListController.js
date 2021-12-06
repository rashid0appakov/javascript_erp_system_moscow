'use strict'
const List = use('App/Models/List')
const ListRow = use('App/Models/ListRow')
const Helpers = use('Helpers')
const Drive = use('Drive')
const Excel   = require('exceljs')
class ListController {
	async index ({ request, response, view }) {
		return await List.query().with('list_fields').fetch()
	}
	async store ({ request }) {
		const data = request.only('name')
		const list = await List.create(data)
		list.list_fields = []
		return list
	}
	async update ({ params, request }) {
		const list = await List.findOrFail(params.id)
		const data = request.only('name')
		list.merge(data)
		await list.save()
		await list.load('list_fields')
		return list
	}
	async destroy ({ params, request, response }) {
		const list = await List.findOrFail(params.id)
		await list.delete()
	}
	async rows({params}){
		return await ListRow.query().where({list_id: params.id}).fetch()
	}
	async uploadRows({ params, request }){
		let list = await List.query().where({id: params.id}).with('list_fields').firstOrFail()
		list = list.toJSON()
		const files = request.file('files', {
			extnames: ['xls', 'xlsx']
		})
		const filelocation = Helpers.publicPath('uploads/lists')
		let filename
		await files.moveAll(filelocation, (file) => {
			filename = `${new Date().getTime()}.${file.extname}`
			return { name: filename }
		})
		if (!files.movedAll()) {
			return files.errors()
		}
		let data = []
		let workbook = new Excel.Workbook()
		workbook = await workbook.xlsx.readFile(filelocation + '/' + filename)
		workbook.worksheets[0].eachRow( (row) => {
			const obj = {
				list_id: list.id,
				value: {}
			}
			list.list_fields.forEach( (field, i) => {
				obj.value[field.id] = row.getCell(i+1).value
			})
			data.push(obj)
		});
		const l = data.length
		for(let i = 0; i < l; i++){
			const row = await ListRow.create({
				list_id: list.id,
				value: JSON.stringify(data[i].value)
			})
			data[i].id = row.id
		}
		await Drive.delete(filelocation + '/' + filename)
		return data
	}
}

module.exports = ListController
