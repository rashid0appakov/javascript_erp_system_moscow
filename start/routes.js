'use strict'

const Route = use('Route')
const Lead = use('App/Models/Lead')
Route.post('/api/v1/telphinEvent', 'AtcController.eventListener')
Route.get('/test', async function(){
	const lead = await Lead.find(17)
	return await lead.sendDefaultEmail({
		body: 'test',
		subject: 'subject'
	})
})
Route.group(() => {
	Route.post('/atc/callback/:number', 'AtcController.callback')
	Route.get('/atc/numbers', 'AtcController.numbers')
	Route.get('/atc/history', 'AtcController.history')
	Route.get('/atc/records', 'AtcController.records')
	Route.get('/atc/records/:id', 'AtcController.record')
	Route.get('/reports', 'ReportController.reports')
	Route.resource('/files', 'FileController').only(['store', 'destroy'])
	.validator( new Map( [
		[ [ 'files.store' ], [ 'File/Store' ] ],
	] ) )
	Route.post( '/logout', 'AuthController.logout' )
	Route.get( '/me', 'AuthController.me' )
	Route.get('/inbox', 'InboxController.index')
	Route.delete('/notifications/:id', 'NotificationController.destroy')
	Route.post( '/users/:id/telegram', 'UserController.telegram' )
	Route.get( '/users/:id/notifications', 'UserController.notifications' )
	Route.post( '/users/:id/uploadPhoto', 'UserController.uploadPhoto' )
	Route.resource( '/users', 'UserController' ).apiOnly().validator( new Map( [
		[ [ 'users.store' ], [ 'User/Store' ] ],
		[ [ 'users.update' ], [ 'User/Update' ]]
	] ) )
	Route.resource( '/settings', 'SettingController' ).apiOnly()
	Route.put('/lead_nodes/updateMany', 'LeadNodeController.updateMany')
	Route.post('/lead_nodes/changeUser', 'LeadNodeController.changeUser')
	Route.post('/lead_nodes/changeBoard', 'LeadNodeController.changeBoard')
	Route.delete('/lead_nodes/destroyMany', 'LeadNodeController.destroyMany')
	Route.delete('/materials/destroyMany', 'MaterialController.destroyMany')
	Route.resource( '/materials', 'MaterialController').apiOnly()
	Route.resource( '/materialCategories', 'MaterialCategoryController').apiOnly()
	Route.resource( '/lead_nodes', 'LeadNodeController' ).apiOnly()
	Route.resource( '/templates', 'TemplateController' ).apiOnly()
	Route.post( '/leads/storeByEmail', 'LeadController.storeByEmail' )
	Route.post( '/leads/createMany', 'LeadController.createMany' )
	Route.post( '/leads/:id/uploadNodes', 'LeadController.uploadNodes' )
	Route.post( '/leads/:id/setUsers', 'LeadController.setUsers' )
	Route.post( '/leads/:id/moveTo', 'LeadController.moveTo' )
	Route.post( '/leads/:id/attachCustomer', 'LeadController.attachCustomer' )
	Route.get( '/leads/:id/getNodes', 'LeadController.getNodes' )
	Route.get( '/leads/getProduction', 'LeadController.getProduction' )
	Route.resource( '/leads', 'LeadController' ).apiOnly()
	Route.resource( '/tasks', 'TaskController' ).apiOnly()
	Route.resource( '/roles', 'RoleController' ).apiOnly()
	Route.get( '/lists/:id/rows', 'ListController.rows' )
	Route.post( '/lists/:id/uploadRows', 'ListController.uploadRows' )
	Route.resource( '/lists', 'ListController' ).apiOnly()
	Route.resource( '/listFields', 'ListFieldController' ).apiOnly()
	Route.resource( '/listRows', 'ListRowController' ).apiOnly()
	Route.get( '/departaments/:id/getRequests', 'DepartamentController.getRequests' )
	Route.post( '/departaments/:id/syncUsers', 'DepartamentController.syncUsers' )
	Route.post( '/departaments/:id/setRule', 'DepartamentController.setRule' )
	Route.post( '/departaments/:id/toggleLead', 'DepartamentController.toggleLead' )
	Route.resource( '/departamentFields', 'DepartamentFieldController' ).apiOnly()
	Route.post( '/departamentRequests/:id/confirm', 'DepartamentRequestController.confirm' )
	Route.post( '/departamentRequests/:id/reject', 'DepartamentRequestController.reject' )
	Route.resource( '/departamentRequests', 'DepartamentRequestController' ).apiOnly()
	Route.resource( '/departaments', 'DepartamentController' ).apiOnly()
	Route.resource( '/funds', 'FundController' ).apiOnly()
	Route.resource( '/leadSources', 'LeadSourceController' ).apiOnly()
	Route.resource( '/boards', 'BoardController' ).apiOnly()
	Route.get( '/customers/:id/leads', 'CustomerController.leads' )
	Route.post( '/customers', 'CustomerController.upload' )
	Route.delete( '/customers', 'CustomerController.destroyMany' )
	Route.resource( '/customers', 'CustomerController' ).apiOnly()
	Route.resource( '/customerTypes', 'CustomerTypeController' ).apiOnly()
	Route.resource( '/customerContacts', 'CustomerContactController' ).apiOnly()
	Route.resource( '/customerAddresses', 'CustomerAddressController' ).apiOnly()
	Route.get( '/messages/getChat', 'MessageController.getChat' )
	Route.resource( '/messages', 'MessageController' ).apiOnly()
	Route.resource( '/invoices', 'InvoiceController' ).apiOnly()
	Route.resource( '/actions', 'ActionController' ).apiOnly(['index', 'store'])
	.validator( new Map( [
		[ [ 'customers.store' ], [ 'Customer/Store' ] ],
	] ) )
	Route.resource( '/permissions', 'PermissionController' ).apiOnly()
	Route.post('/emails/default', 'EmailController.default')
	Route.post('/emails/lead', 'EmailController.lead')
}).prefix('/api/v1').middleware(['auth'])
Route.group(function(){
	Route.post( '/login', 'AuthController.login' ).validator( 'AuthLogin' )
	Route.resource('/files', 'FileController').only(['show'])
}).prefix('/api/v1').middleware(['guest'])


Route.any('*', ({view}) =>  view.render('app'))
