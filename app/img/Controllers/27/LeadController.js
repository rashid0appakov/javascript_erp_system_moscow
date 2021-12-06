'use strict'
const Helpers = use('Helpers')
const Drive = use('Drive')
const Database = use('Database')
const Excel   = require('exceljs')
const { forEach } = require('lodash')
const moment = require('moment')
const Customer = use('App/Models/Customer')
const CustomerContact = use('App/Models/CustomerContact')
const Message = use('App/Models/Message')
const Task = use('App/Models/Task')
const Board = use('App/Models/Board')
const Lead = use('App/Models/Lead')
const LeadNode = use('App/Models/LeadNode')
const Notification = use('App/Models/Notification')
const Event = use('Event')
const Mail = use('Mail')
const Env = use('Env')
class LeadController {
	async index({ request }) {
		  let query = Lead.query().with('customer').with('manager').with('boards')
		  const { active } = request.all()
		  if(active) query = query.where('active', 1)
		  return await query.fetch()
	}
	async getProduction(){
		const query = `
		SELECT COUNT(lead_nodes.id) as count, lead_nodes.board_id, boards.name as stage, boards.color, leads.id as lead_id, leads.created_at, leads.updated_at
		FROM lead_nodes
		JOIN leads ON leads.id = lead_nodes.lead_id
		JOIN boards ON lead_nodes.board_id = boards.id
		WHERE boards.departament_id=5
		GROUP BY board_id, lead_id
		`
		const result = await Database.raw(query)
		return result[0]
	}
	async attachCustomer({ request, params }) {
		const lead = await Lead.findOrFail(params.id)
		let {customer_id} = request.all()
		if(!customer_id) customer_id = null
		lead.merge({customer_id})
		await lead.save()
		const customer = await lead.customer().fetch()
		if(customer)
			await lead.history().create({
				body: 'Изменен заказчик ' + customer.name
			})
		Event.fire('update_lead', lead.id)
		return customer
	}
	async storeByEmail({request}){
		let customer
		const data = request.all()
		const defaultBoard = await Board.findBy({departament_id: data.departament_id, isDefault: 1})
		if(!defaultBoard) return response.status(404).json({ message: 'Не удалось создать лид. Не найдена доска по умолчанию.'})
		const lead = await Lead.create()
		defaultBoard.leads().attach([lead.id], row => {
			if (row.lead_id === lead.id && row.board_id == defaultBoard.id) {
				row.departament_id = defaultBoard.departament_id
			}
		})
		const contact = await CustomerContact.findBy('email', data.message.from[0].address)
		if(!contact){
			customer = await Customer.create({name: data.message.from[0].name})
			await customer.contacts().create({email: data.message.from[0].address})
		}else{
			customer = await contact.customer().fetch()
		}
		lead.customer_id = customer.id
		await lead.save()
		await Message.create({
			body: data.message.subject,
			messageable_id: lead.id,
			messageable_type: 'leads'
		})
		Event.fire('update_departaments')
	}
	async setUsers({params, request}){
		const users = request.input('users')
		const lead = await Lead.findOrFail(params.id)
		await lead.users().sync(users)
		const notifications = []
		users.forEach(id =>{
			notifications.push({
				user_id: id,
				text: 'Вас назначили ответственным за лидом #' + params.id
			})
		})
		Notification.createMany(notifications)
		Event.fire('send_notifications', users)
		Event.fire('update_lead', lead.id)
		return await lead.users().fetch()
	}
	async createMany({ request, auth }) {
		const {departament_id, board_id, customers, message} = request.all()
		let data = []
		const board = await Board.findOrFail(board_id)
		customers.forEach( customer => {
			data.push({
				source: auth.user.name,
				customer_id: customer
			})
		})
		let leads = await Lead.createMany(data)
		leads = leads.map( l => l.id)
		await board.leads().attach(leads, row => { row.departament_id = departament_id })
		if(message){
			data = []
			leads.forEach( lead => {
				data.push({
					body: message,
					messageable_id: lead,
					messageable_type: 'leads',
					user_id: auth.user.id,
					username: auth.user.name
				})
			})
			await Message.createMany(data)
		}
		for(let i = 0; i < leads.length; i ++){
			await this._doAction({
				from: false,
				to: board_id,
				lead_id: leads[i],
			})
		}
		Event.fire('update_departaments')
	}
	async store({ request, response, auth }) {
		const {departament_id, customer_id} = request.all()
		const message = request.input('message')
		const defaultBoard = await Board.findBy({departament_id, isDefault: 1})
		if(!defaultBoard) return response.status(404).json({ message: 'Не удалось создать лид. Не найдена доска по умолчанию.'})
		const data = { source: auth.user.name }
		if(customer_id) data.customer_id = customer_id
		const lead = await Lead.create(data)
		defaultBoard.leads().attach([lead.id], row => {
			if (row.lead_id === lead.id && row.board_id == defaultBoard.id) {
				row.departament_id = defaultBoard.departament_id
			}
		})
		if(message){
			await Message.create({
				body: message,
				messageable_id: lead.id,
				messageable_type: 'leads',
				user_id: auth.user.id,
				username: auth.user.name
			})
		}
		Event.fire('update_departaments')
		await this._doAction({
			from: false,
			to: defaultBoard.id,
			lead_id: lead.id,
		})
		return lead
	}
	async show({ params }) {
		const lead = await Lead.findOrFail(params.id)
		await lead.loadMany(['customer', 'customer.contacts', 'customer.addresses','boards','lead_nodes','manager', 'users','funds','files','messages', 'messages.user', 'tasks', 'tasks.user', 'transportations', 'invoice', 'invoice.rows', 'history', 'requests'])
		return lead
	}
	async update({ params, request }) {
		const lead = await Lead.findOrFail(params.id)
		const data = request.only(['customer_id', 'title', 'user_id', 'sort', 'price'])
		lead.merge(data)
		await lead.save()
		Event.fire('update_lead', lead.id)
	}
	async destroy({ params }) {
		const lead = await Lead.findOrFail(params.id)
		await lead.delete()
		Event.fire('update_departaments')
	}
	async moveTo( {request, params} ){
		const {from, to, departament_id} = request.all()
		await Database.table('board_lead').where({ lead_id: params.id, board_id: from}).update({ board_id: to})
		Event.fire('update_departaments')
		await this._doAction({
			from: from,
			to: to,
			lead_id: params.id,
		})
	}
	async _doAction(options){
		let boardFrom = false, boardTo = false, settingsFrom = false, settingsTo = false, emails = [], tasks = [], users = [];
		const lead = await Lead.find(options.lead_id)
		if(!lead) return false
		if(options.from){
			boardFrom = await Board.find(options.from)
			boardFrom = boardFrom.toJSON()
			settingsFrom = JSON.parse(boardFrom.settings)
		}
		if(options.to){
			boardTo = await Board.find(options.to)
			boardTo = boardTo.toJSON()
			settingsTo = JSON.parse(boardTo.settings)
		}
		if(!options.from){
			emails = settingsTo.emails.filter( item => item.actionOn == 3)
			tasks = settingsTo.tasks.filter( item => item.actionOn == 3)
			users = settingsTo.users.filter( item => item.actionOn == 3)
		}else{
			emails = [
				...settingsFrom.emails.filter( item => item.actionOn == 2),
				...settingsTo.emails.filter( item => item.actionOn == 1),
			]
			tasks = [
				...settingsFrom.tasks.filter( item => item.actionOn == 2),
				...settingsTo.tasks.filter( item => item.actionOn == 1),
			]
			users = [
				...settingsFrom.users.filter( item => item.actionOn == 2),
				...settingsTo.users.filter( item => item.actionOn == 1),
			]
		}
		for(let i = 0; i < emails.length; i ++){
			const email = emails[i]
			if(email.template_id){
				lead.sendTemplateEmail(email.template_id)
			}else lead.sendDefaultEmail(email)
		}
		for(let i = 0; i < tasks.length; i ++){
			const task = tasks[i]
			const taskData = []
			task.users.forEach( u => {
				taskData.push({
					body: task.message,
					to_user_id: u,
					lead_id: options.lead_id	
				})
			})
			await Task.createMany(taskData)
		}
		for(let i = 0; i < users.length; i ++){
			const user = users[i]
			if(user.keep) await lead.users().attach(user.users)
			else {
				await lead.users().sync([])
				await lead.users().sync(user.users)
			}
		}
	}
	async uploadNodes({ params, request }){
		const lead = await Lead.findOrFail(params.id)
		const defaultBoard = await Board.query().where({isDefault: 1, departament_id: 5}).firstOrFail()
		const files = request.file('files', {
			extnames: ['xls', 'xlsx']
		})
		const filelocation = Helpers.publicPath('uploads/leads/'+params.id)
		let filename
		await files.moveAll(filelocation, (file) => {
			filename = `${new Date().getTime()}.${file.extname}`
			return { name: filename }
		})
		if (!files.movedAll()) {
			return files.errors()
		}
		let parent_id = 0
		let l = 0
		let data = []
		let workbook = new Excel.Workbook()
		workbook = await workbook.xlsx.readFile(filelocation + '/' + filename)
		workbook.worksheets[0].eachRow( (row) => {
			const obj = {
				name: row.getCell(1).value,
				number: row.getCell(2).value,
				quantity: row.getCell(3).value,
				cut: row.getCell(5).value,
				len: row.getCell(6).value,
				weight: row.getCell(7).value,
				weight_total: row.getCell(8).value,
				weight_element: row.getCell(9).value,
				mark: row.getCell(10).value,
				description: row.getCell(11).value,
				lead_id: params.id,
			}
			obj.board_id = defaultBoard.id
			if(obj.number && Number(obj.number) == obj.number){
				data.push(obj)
				l++
			}
		});
		for(let i = 0; i < l; i++){
			if(data[i].name){
				const node = await LeadNode.create(data[i])
				parent_id = node.id
			}else{
				data[i].parent_id = parent_id
				await LeadNode.create(data[i])
			}
		}
		lead.hasNodes = l
		await lead.save()
		return l
	}
	async getNodes({params}){
		const lead = await Lead.findOrFail(params.id)
		return await lead.lead_nodes().with('board').with('user', builder => {
			builder.select(['id', 'name'])
		}).fetch()
	}
	async destroy({ params }){
		const lead = await Lead.findOrFail(params.id)
		await lead.delete()
		Event.fire('update_departaments')
		Event.fire('update_lead', false)
	}
}

module.exports = LeadController