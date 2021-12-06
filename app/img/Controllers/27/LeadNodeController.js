'use strict'
const LeadNode = use('App/Models/LeadNode')
const User = use('App/Models/User')
const Board = use('App/Models/Board')
class LeadNodeController {
	async changeBoard({request}){
		const {board_id, ids} = request.all()
		if(!board_id || !ids) return false
		await LeadNode.query().whereIn('id', ids).update({board_id})
		return await Board.find(board_id)
	}
	async changeUser({request}){
		const {user_id, ids} = request.all()
		if(!user_id || !ids) return false
		await LeadNode.query().whereIn('id', ids).update({user_id})
		return await User.find(user_id)
	}
	async destroyMany({request}){
		const ids = request.input('ids')
		return await LeadNode.query().whereIn('id', ids).delete()
	}
	async updateMany({request}){
		const ids = request.input('ids')
		const k = request.input('k')
		return await LeadNode.query().whereIn('id', ids).update({k})
	}
	async store({request}){
		const data = request.only(['name', 'number', 'quantity', 'cut', 'len', 'weight', 'weight_total', 'weight_element', 'mark', 'description', 'parent_id', 'board_id', 'lead_id', 'user_id', 'k'])
		const node = await LeadNode.create(data)
		await node.loadMany(['user', 'board'])
		return node
	}
	async update({params, request}){
		const node = await LeadNode.findOrFail(params.id)
		const data = request.only(['name', 'number', 'quantity', 'cut', 'len', 'weight', 'weight_total', 'weight_element', 'mark', 'description', 'parent_id', 'board_id', 'lead_id', 'user_id', 'k'])
		console.log(data)
		node.merge(data)
		await node.save()
		await node.loadMany(['user', 'board'])
		return node
	}
}

module.exports = LeadNodeController
