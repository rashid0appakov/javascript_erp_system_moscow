'use strict'
const topics = {}
const socketMap = {}
class LeadController {
	constructor ({ socket, auth }) {
		socket.uid = auth.user.id
		socketMap[socket.id] = socket
		if(!topics[socket.topic]) topics[socket.topic] = {}
		topics[socket.topic][auth.user.id] = auth.user
		for(let p in socketMap){
			if(socketMap[p].topic == socket.topic) socketMap[p].emit('watchers', Object.values(topics[socket.topic]))
		}
	}
	onClose ( socket ) {
		const id = socketMap[socket.id].uid
		delete socketMap[socket.id]
		delete topics[socket.topic][id]
		for(let p in socketMap){
			if(socketMap[p].topic == socket.topic) socketMap[p].emit('watchers', Object.values(topics[socket.topic]))
		}
	}
	onError( err ){
		console.log(err)
	}
}

module.exports = LeadController
