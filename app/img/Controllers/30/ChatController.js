'use strict'
const Message = use('App/Models/Message')
class ChatController {
  	constructor({ socket, auth }) {
		this.user = auth.user
		this.socket = socket
	}
	async onMessage(body) {
		const message = await Message.create({
			messageable_type: 'chat',
			user_id: this.user.id,
			username: this.user.name,
			body
		})
		await message.load('user')
    	this.socket.broadcastToAll('message', message)
	}
}

module.exports = ChatController