'use strict'
const Task = use('App/Models/Task')
const Event = use('Event')
class TaskController {
	async index () {
		return await Task.all()
	}
	async store ({ auth, request }) {
		const data = request.only(['to_user_id', 'notify_at', 'body', 'lead_id'])
		data.user_id = auth.user.id
		const task = await Task.create(data)
		if(task.lead_id) Event.fire('update_lead', task.lead_id)
		return task
	}
	async update ({ params, request, response }) {
	}
	async destroy ({ params, request, response }) {
	}
}

module.exports = TaskController
