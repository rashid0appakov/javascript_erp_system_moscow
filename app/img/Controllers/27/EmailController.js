'use strict'
const Lead = use('App/Models/Lead')
const Template = use('App/Models/Template')
const moment = require('moment')
const Mail = use('Mail')
const Env = use('Env')
const Contact = use('App/Models/CustomerContact')
class EmailController {
    async default( { request } ){
		const data = request.all()
		await Mail.send('emails.default', data, (message) => {
		message
			.to(data.to)
			.from(Env.get('MAIL_USERNAME'))
			.subject(data.subject)
		})
    }
    async lead({ request }){
        const template_id = request.input('template')
        const lead_id = request.input('lead_id')
        if(!template_id) return await this.default({request})
        const template = await Template.findOrFail(template_id)
        const lead = await Lead.findOrFail(lead_id)
        let users = await lead.users().fetch()
        users = users.toJSON()
        let usersHtml = ''
        users.forEach( user => {
            usersHtml += '<p>'+user.name + ' '+ user.surname + '<br>E-mail:<b>' + user.email + '</b><br>Телефон:<b>'+ user.phone +'<b></p>'
        })
        let body = template.body.replace('#id', lead.id).replace('#date#', moment(lead.created_at).format('DD.MM.YYYY')).replace('#users#', usersHtml)
        const user = await Contact.find(request.input('user_id'))
        if(user) body = body.replace('#user#', (user.name))
        await Mail.send('emails.lead', {body}, (message) => {
            message
                .to(request.input('to'))
                .from(Env.get('MAIL_FROM'))
                .subject(template.subject)
            })
    }
}

module.exports = EmailController
