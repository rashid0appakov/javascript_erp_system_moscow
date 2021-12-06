'use strict'
const Setting = use('App/Models/Setting')
class SettingController {
    async index () {
        const settings = await Setting.all()
        const obj = {}
        settings.toJSON().forEach( s => {
            obj[s.key] = +s.value
        })
        return obj
    }
    async store ({ request }) {
        const data = request.all()
        const key = Object.keys(data)[0]
        const value = data[key]
        const item = await Setting.findBy('key', key)
        if(!item) return await Setting.create({ key, value })
        else {
            item.merge({value})
            await item.save()
            return item
        }
    }
    async destroy ({ params, request, response }) {
    }
}

module.exports = SettingController
