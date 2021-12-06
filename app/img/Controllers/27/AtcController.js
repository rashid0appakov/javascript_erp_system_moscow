'use strict'
const moment = require('moment')
const Telphin = use('App/Classes/Telphin')
const LeadSource = use('App/Models/LeadSource')
const Lead = use('App/Models/Lead')
const Board = use('App/Models/Board')
const Database = use('Database')
const Event = use('Event')
const Logger = use('Logger')
class AtcController {
    async records({ request }){
        const data = request.all()
        return await Telphin.getRecords(data.from, data.end, data.number)
    }
    async history({ request }){
        const data = request.all()
		return await Telphin.getHistory(data.from, data.end, data.numbers)
	}
	async record({params}){
        return await Telphin.getRecord(params.id)
    }
    async callback({auth, params}){
        const extention_id = auth.user.extention_id
        if(!params.number || !extention_id){
            return false
        }
        return await Telphin.callback(extention_id, params.number)
    }
    async numbers(){
        return await Telphin.getNumbers()
    }
    async eventListener({request}){
        const {CallID} = request.all()
        const call = await Telphin.getCall(CallID)
        let clientNumber, operatorNumber;
        if(call.flow == 'in'){
            clientNumber = call.from_username
            operatorNumber = call.to_username
        }else{
            operatorNumber = call.from_username
            clientNumber = call.to_username
        }
        const source = await LeadSource.query().where('value', operatorNumber).fetch()
        const ids = source.toJSON().map( s => s.board_id)
        const lead = await Lead.create({ source: clientNumber })
        let boards = await Board.query().whereIn('id', ids).fetch()
        const data = []
        boards = boards.toJSON().forEach( b => { 
            data.push({
                board_id: b.id,
                departament_id: b.departament_id,
                lead_id: lead.id
            })
        })
        await Database.from('board_lead').insert(data)
        Event.fire('update_departaments')
    }
}

module.exports = AtcController
