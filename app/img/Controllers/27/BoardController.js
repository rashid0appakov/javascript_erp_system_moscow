'use strict'
const Board = use('App/Models/Board')
const Event = use('Event')
const Telphin = use('App/Classes/Telphin')
class BoardController {
	async index({request}){
		const {departament_id} = request.all()
		return departament_id ? await Board.query().where({departament_id}).fetch() : await Board.all()
	}
	async store ({ request }) {
		const data = request.only(['name', 'color', 'sort', 'settings', 'departament_id', 'isDefault', 'donePlus', 'doneMinus', 'timePlus', 'timeMinus', 'time'])
		await Board.create(data)
		Event.fire('update_departaments')
	}
	async update ({ params, request }) {
		const board = await Board.findOrFail(params.id)
		const {isDefault, departament_id} = request.all()
		const data = request.only(['name', 'color', 'sort', 'settings', 'isDefault', 'donePlus', 'doneMinus', 'timePlus', 'timeMinus', 'time'])
		if(isDefault){
			await Board.query().where({ departament_id  }).update({ isDefault: 0 })
		}
		board.merge(data)
		await board.save()
		Event.fire('update_departaments')
	}
	async destroy({ params }) {
		const board = await Board.findOrFail(params.id)
		await board.delete()
		Event.fire('update_departaments')
	}
}

module.exports = BoardController
