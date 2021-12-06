'use strict'
const Notification = use('App/Models/Notification')
class NotificationController {
	async destroy({params}){
		const notification = await Notification.findOrFail(params.id)
		await notification.delete()
	}
}

module.exports = NotificationController
