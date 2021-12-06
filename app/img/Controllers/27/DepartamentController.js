'use strict'
const Event = use('Event')
const Departament = use('App/Models/Departament')
const Database = use('Database')
const Board = use('App/Models/Board')
const Lead = use ('App/Models/Lead')
class DepartamentController {
	async index({ auth }){
		return await Departament.query()
		.with('users', builder => {
			builder.with('role')
		})
		.with('boards', builder => {
			builder.with('lead_sources')
				.with('leads', builder => {
				builder.with('requests')
				.with('customer')
				.where('active', 1)
			})
		})
		.with('fields')
		.with('teams')
		.fetch()
	}
	async getRequests({params, request}){
		const {lead_id} = request.all()
		return await Departament.query()
		.with('requests', builder => {
			builder.where({lead_id})
		})
		.whereHas('requests')
		.where({parent_id: params.id})
		.fetch()
	}
	async toggleLead({params, request}){
		const {id} = request.all()
		const row = await Database.table('board_lead').where({lead_id: id, departament_id: params.id}).first()
		if(!row){
			const defaultBoard = await Board.findBy({departament_id: params.id, isDefault: 1})
			await defaultBoard.leads().attach([id], row => {
				if (row.lead_id == id && row.board_id == defaultBoard.id) {
					row.departament_id = params.id
				}
			})
			Event.fire('update_departaments')
		}else{
			await Database.table('board_lead').where({lead_id: id, departament_id: params.id}).delete()
			Event.fire('update_departaments')
		}
	}
	async setRule( { params, request }){
		const {user_id, rule} = request.all()
		await Database.table('departament_user').where({user_id, departament_id: params.id}).update('access', rule)
		Event.fire('update_departaments')
	}
	async syncUsers( { params, request }){
		const departament = await Departament.findOrFail(params.id)
		const {users} = request.all()
		await departament.users().sync(users)
		Event.fire('update_departaments')
		return await departament.users().fetch()
	}
	async store ({ request }) {
		const departament = await Departament.create(request.only(['name', 'parent_id']))
		Event.fire('update_departaments')
		return departament
	}
	async update ({ params, request }) {
		const departament = await Departament.findOrFail(params.id)
		departament.merge(request.only('name'))
		await departament.save()
		Event.fire('update_departaments')
		return departament
	}
	async destroy ({ params }) {
		const departament = await Departament.findOrFail(params.id)
		if(!departament.parent_id) return false
		await departament.delete()
		Event.fire('update_departaments')
	}
}

module.exports = DepartamentController
