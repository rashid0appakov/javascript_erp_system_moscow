'use strict'
const Message = use('App/Models/Message')
const Event = use('Event')
class MessageController {
	async store ({ request, auth }) {
		const data = request.only(['body', 'messageable_id', 'messageable_type'])
		data.user_id = auth.user.id
		const message = await Message.create(data)
		if(message.messageable_type == 'leads') Event.fire('update_lead', message.messageable_id)
		return message
	}
	async getChat(){
		return await Message.query().with('user').where('messageable_type', 'chat').limit(20).fetch()
	}
	async destroy ({ params, request, response }) {
	}
}

module.exports = MessageController
