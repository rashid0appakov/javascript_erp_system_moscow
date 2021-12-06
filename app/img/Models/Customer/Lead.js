'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Template = use('App/Models/Template')
const Mail = use('Mail')
const Env = use('Env')
const moment = require('moment')
class Lead extends Model {
    static boot() {
		super.boot()
		this.addHook('beforeDelete', 'LeadHook.removeRelations')
	}
    customer(){
        return this.belongsTo('App/Models/Customer')
    }
    manager(){
        return this.belongsTo('App/Models/User')
    }
    users(){
        return this.belongsToMany('App/Models/User')
    }
    lead_nodes(){
        return this.hasMany('App/Models/LeadNode')
    }
    files(){
        return this.hasMany('App/Models/File', 'id', 'fileable_id').where('fileable_type', 'leads')
    }
    messages(){
        return this.hasMany('App/Models/Message', 'id', 'messageable_id').where('messageable_type', 'leads').orderBy('created_at', 'desc')
    }
    tasks(){
        return this.hasMany('App/Models/Task')
    }
    boards(){
        return this.belongsToMany('App/Models/Board')
    }
    funds(){
        return this.hasMany('App/Models/Fund')
    }
    transportations(){
        return this.hasMany('App/Models/Transportation')
    }
    invoice(){
        return this.hasOne('App/Models/Invoice')
    }
    history(){
        return this.hasMany('App/Models/LeadHistory')
    }
    requests(){
        return this.hasMany('App/Models/DepartamentRequest')
    }
    async getContacts(){
        const customer = await this.customer().fetch()
        let contacts = await customer.contacts().fetch()
        contacts = contacts.toJSON()
        contacts = contacts.filter( c => c.email)
        return contacts
    }
    async sendDefaultEmail(email){
        const contacts = await this.getContacts()
        for(let i = 0; i < contacts.length; i ++){
            const to = contacts[i]
            await Mail.send('emails.default', email, (message) => {
            message
                .to(to.email)
                .from(Env.get('MAIL_USERNAME'))
                .subject(email.subject)
            })
        }
    }
    async sendTemplateEmail(template_id){
        if(!template_id) return false
        const template = await Template.find(template_id)
        let users = await this.users().fetch()
        users = users.toJSON()
        let usersHtml = ''
        users.forEach( user => {
            usersHtml += '<p>'+user.name + ' '+ user.surname + '<br>E-mail:<b>' + user.email + '</b><br>Телефон:<b>'+ user.phone +'<b></p>'
        })
        let body = template.body.replace('#id', this.id).replace('#date#', moment(this.created_at).format('DD.MM.YYYY')).replace('#users#', usersHtml)
        const contacts = await this.getContacts()
        for(let i = 0; i < contacts.length; i ++){
            const to = contacts[i]
            const emailBody = body.replace('#user#', (to.name))
            await Mail.send('emails.lead', {body: emailBody}, (message) => {
                message
                    .to(to.email)
                    .from(Env.get('MAIL_FROM'))
                    .subject(template.subject)
                })
        }
    }
}

module.exports = Lead
