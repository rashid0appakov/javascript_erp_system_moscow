'use strict'
const ListRow = use('App/Models/ListRow')
class ListRowController {
    async store({request}){
        const data = request.only(['list_id', 'value'])
        return await ListRow.create(data)
    }
    async update({params, request}){
        const row = await ListRow.findOrFail(params.id)
        const data = request.only(['list_id', 'value'])
        row.merge(data)
        await row.save()
    }
    async destroy({params}){
        const row = await ListRow.findOrFail(params.id)
        await row.delete()
    }
}

module.exports = ListRowController
