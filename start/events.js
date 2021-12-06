const Event = use('Event')
const Ws = use('Ws')
const Departament = use('App/Models/Departament')
const Lead = use('App/Models/Lead')
const Notification = use('App/Models/Notification')
Event.on('send_notifications', async (users) => {
	users.forEach(id => {
		notifications = Notification.query().where({user_id: id}).fetch()
		const channel = Ws.getChannel('user:*').topic('user:'+id)
		if(!channel) return false
		channel.broadcastToAll('notifications', notifications)
	})
})
Event.on('update_user', async (user) => {
	const channel = Ws.getChannel('main').topic('main')
	if(!channel) return false
	await user.load('role')
	channel.broadcast('update_user', user)
})
Event.on('update_lead', async (id) => {
	if(!id) channel.broadcastToAll('update', 0)
	const lead = await Lead.find(id)
	if(!lead) return false
	await lead.loadMany(['customer', 'customer.contacts', 'customer.addresses','boards','lead_nodes','manager', 'users','funds','files','messages', 'messages.user', 'tasks', 'transportations', 'invoice', 'invoice.rows', 'history', 'requests'])
	const channel = Ws.getChannel('lead:*').topic('lead:'+id)
	if(!channel) return false
	channel.broadcastToAll('update', lead)
})
Event.on('update_departaments', async (auth_user) => {
	const items = await Departament.query()
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
	const channel = Ws.getChannel('main').topic('main')
	if(!channel) return false
	channel.broadcastToAll('update_departaments', items)
})