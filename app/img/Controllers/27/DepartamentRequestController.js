'use strict'
const DepartamentRequest = use('App/Models/DepartamentRequest')
const DepartamentField = use('App/Models/DepartamentField')
const Departament = use('App/Models/Departament')
const Board = use('App/Models/Board')
const Event = use('Event')
const Task = use('App/Models/Task')
const moment = require('moment')
const User = use('App/Models/User')
const Database = use('Database')
class DepartamentRequestController {
	async index(){
		return await DepartamentRequest.query().with('worker').fetch()
	}
	async show({params}){
		const req = await DepartamentRequest.query().with('author').with('worker').where({ id: params.id}).firstOrFail()
		req.fields = await DepartamentField.query().where({departament_id: req.departament_id}).fetch()
		return req
	}
	async store ({ request, auth }) {
		const data = request.all()
		const defaultBoard = await Board.findBy({departament_id: data.departament_id, isDefault: 1})
		if(!defaultBoard) return response.status(404).json({ message: 'Не удалось создать лид. Не найдена доска по умолчанию.'})
		defaultBoard.leads().attach([data.lead_id], row => {
			if (row.lead_id === data.lead_id && row.board_id == defaultBoard.id) {
				row.departament_id = defaultBoard.departament_id
			}
		})
		const departament = await Departament.findOrFail(data.departament_id)
		const req = await DepartamentRequest.create({
			worker_user_id: data.worker_user_id,
			author_user_id: auth.user.id,
			departament_id: data.departament_id,
			lead_id: data.lead_id,
			data: JSON.stringify(data.data),
			expired_at: moment().add(departament.time, 'hours').format('YYYY-MM-DD HH:mm:00')
		})
		Event.fire('update_lead', req.lead_id)
		Event.fire('update_departaments')
		await Task.create({
			user_id: auth.user.id,
			to_user_id: data.worker_user_id,
			lead_id: data.lead_id,
			color: defaultBoard.color,
			body: defaultBoard.name,
			expired_at: req.expired_at,
			departament_id: data.departament_id
		})
		return req
	}
	async reject({ request, params }){
		const req = await DepartamentRequest.findOrFail(params.id)
		const comment = request.input('comment')
		if(!comment) return false
		if(req.status != 'DONE') return false
		req.status = 'NEW'
		req.comment = comment
		await req.save()
		const defaultBoard = await Board.query().where({departament_id: req.departament_id, isDefault: 1}).first()
		if(defaultBoard){
			await Database.table('board_lead').where({ lead_id: req.lead_id, departament_id: req.departament_id}).update({ board_id: defaultBoard.id})
		}
		Event.fire('update_departaments')
	}
	async confirm({ request, params }){
		const req = await DepartamentRequest.findOrFail(params.id)
		if(req.status != 'DONE') return false
		let money = 0
		req.status = 'CONFIRM'
		await req.save()
		const departament = await req.departament().fetch()
		money += departament.donePlus
		if(moment().isBefore(departament.expired_at)){
			money += departament.timePlus
		}else{
			money -= departament.timeMinus
		}
		const user = await User.find(req.worker_user_id)
		if(!user) return false
		user.balance += money
		await user.save()
	}
	async update ({ params, request }) {
		const req = await DepartamentRequest.findOrFail(params.id)
		const data = request.only(['comment', 'status'])
		data.data = JSON.stringify(request.input('data')),
		req.merge(data)
		await req.save()
		Event.fire('update_lead', req.lead_id)
	}
	async destroy ({ params, request, response }) {
	}
}

module.exports = DepartamentRequestController
