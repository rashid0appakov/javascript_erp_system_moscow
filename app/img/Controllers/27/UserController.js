'use strict'
const User = use( 'App/Models/User' )
const Helpers = use('Helpers')
const Drive = use('Drive')
const Env = use('Env')
const axios = require('axios')
class UserController {
	async index() {
		return await User.query().with('role').with('departaments').with('permissions').where('role_id', '>', 1).fetch()
	}
	async telegram({ request, params }){
		const user = await User.findOrFail(params.id)
		if(!user.telegram_id) return false
		const message = request.input('message')
		const TELEGRAM_TOKEN = Env.get('TELEGRAM_TOKEN')
		const url = 'https://api.telegram.org/bot' + TELEGRAM_TOKEN + '/sendMessage'
		const {data} = await axios.post(url, {
			chat_id: user.telegram_id,
			text: message
		})
		return data
	}
	async show( { params } ) {
		const item = await User.findOrFail( params.id )
		await item.loadMany(['role', 'files'])
		return item
	}
	async store( { request } ) {
		const data = request.only( [ 'name', 'surname', 'lastname', 'email', 'password', 'active', 'role_id', 'extention_id', 'telegram_id', 'email_login', 'email_password', 'notifications' ] )
		const item = await User.create( data )
		await item.loadMany( [ 'role', 'files', 'role.permissions', 'permissions']);
		return item
	}
	async notifications({params}){
		const item = await User.findOrFail( params.id )
		return await item.notifications().fetch()
	}
	async update( { params, request } ) {
		const item = await User.findOrFail( params.id )
		const data = request.only( [ 'name', 'surname', 'lastname', 'email', 'password', 'active', 'role_id', 'extention_id', 'telegram_id', 'email_login', 'email_password', 'notifications' ] )
		const { password } = request.all()
		if ( password ) { data.password = password }
		item.merge( data )
		await item.save()
		await item.loadMany(['role', 'files', 'role.permissions', 'permissions']);
		return item
	}
	async uploadPhoto( {request, params} ){
		const item = await User.findOrFail( params.id )
		const files = request.file('files')
		const path = Helpers.publicPath('uploads/users/'+item.id)
		let name = '';
		await files.moveAll(path, (file) => {
            name = `${new Date().getTime()}.${file.extname}`
			return { name }
		})
		if (!files.movedAll()) {
			await Promise.all(movedFiles.map((file) => {
				return Drive.delete(file._location + '/' + file._fileName)
			}))
			return files.errors()
		}
		const src = 'uploads/users/'+item.id +'/'+name
		item.merge({photo: src})
		await item.save()
		return src
	}
	async destroy( { params } ) {
		const item = await User.findOrFail( params.id )
		return await item.delete()
	}
}
module.exports = UserController
