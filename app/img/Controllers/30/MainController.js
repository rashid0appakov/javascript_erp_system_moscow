'use strict'
const users = {}
const socketMap = {}
const moment = require('moment')
class MainController {
	constructor ({ socket, auth }) {
		socket.uid = auth.user.id
		this.socket = socket
		socketMap[socket.id] = socket
		users[auth.user.id] = auth.user
		for(let p in socketMap){
			socketMap[p].emit('update_users', Object.values(users))
		}
	}
	onClose ( socket ) {
		const id = socketMap[socket.id].uid
		delete socketMap[socket.id]
		users[id].activity_at = moment().format('YYYY-MM-DD HH:mm:ss')
		users[id].save()
		delete users[id]
		for(let p in socketMap){
			socketMap[p].emit('update_users', Object.values(users))
		}
	}
	onError( err ){
		console.log(err)
	}
}

module.exports = MainController
