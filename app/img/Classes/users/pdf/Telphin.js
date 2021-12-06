'use strict'
const axios = require('axios')
const Fs = require('fs')
const Download = require('download')
const Path = require('path')  
const Cache = use('Cache')
const qs = require('querystring');
class Telphin{
    async setup(){
        let token = await Cache.get('telphin_token')
        if(!token){
            try{
                const {data} = await axios.post('https://apiproxy.telphin.ru/oauth/token', qs.stringify({
                    grant_type: 'client_credentials',
                    client_id: '72c9fa52996047ada79b6b2f58e333bb',
                    client_secret: '5b29d2d14be04138831b5efd989b5b59'
                }), {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                })
                token = data.access_token
                await Cache.put('telphin_token', token, (data.expires_in / 60) - 2)
            }catch(e){}
        }
        axios.defaults.baseURL = 'https://apiproxy.telphin.ru/api/ver1.0'
        axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded'
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
    }
    async getRecords(start_datetime, end_datetime, number){
        await this.setup()
        const {data} = await axios.get('/client/@me/record', {
            params: { start_datetime, end_datetime },
        })
		return data.filter( r => r.dest_number == number)
    }
    async getHistory(start_datetime, end_datetime, numbers){
        await this.setup()
        const paramsIn = qs.stringify({
            start_datetime,
            end_datetime,
            flow: 'in',
            from_username: numbers
        })
        const paramsOut = qs.stringify({
            start_datetime,
            end_datetime,
            flow: 'out',
            to_username: numbers
        })
        const resIn = await axios.get('/client/@me/calls?'+paramsIn)
        const resOut = await axios.get('/client/@me/calls?'+paramsOut)
        return [...resIn.data.calls, ...resOut.data.calls]
    }
    async getRecord(id){
        await this.setup()
        const {data} = await axios.get('/client/@me/record/'+id+'/storage_url/')
        const filename = Date.now() + '.mp3'
        const path = Path.resolve(process.cwd(), 'public/uploads/records/', filename)
        Fs.writeFileSync(path, await Download(data.record_url))
        return filename
    }
    async callback(extention_id, dst_num){
        await this.setup()
        try{
            const id = Math.floor(Math.random() * 2000)
            const {data} = await axios.post('/extension/'+extention_id+'/callback/', {
                dst_num: dst_num,
                src_num: [
                    "128"
                ],
                call_api_id: id,
                call_id: id
            })
            return data
        }catch(e){
            console.log(e.response.data)
        }
    }
    async addHook(extention_id){
        await this.setup()
        try{
            const {data} = await axios.post('/extension/'+extention_id+'/event/', {
                url: "http://erp.fvds.ru/api/v1/telphinEvent?extention_id="+extention_id,
                method: "POST",
                event_type: "dial-in"
            })
            return data
        }catch(e){}
    }
    async getNumbers(){
        await this.setup()
        const {data} = await axios.get('/client/@me/did/')
        return data
    }
    async getCall(CallID){
        await this.setup()
        const {data} = await axios.get('/client/@me/call_history/'+CallID)
        return data
    }
    async destroyHook(extention_id, event_id){
        await this.setup()
        const {data} = await axios.delete('/extension/'+extention_id+'/event/'+event_id)
        console.log('destroyHook: ', data)
        return data
    }
}

module.exports = new Telphin