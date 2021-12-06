'use strict'
const ListField = use('App/Models/ListField')
class ListFieldController {
    async store({request}){
        const data = request.only(['name', 'list_id'])
        return await ListField.create(data)
    }
    async update({params, request}){
        const field = await ListField.findOrFail(params.id)
        const data = request.only('name')
        field.merge(data)
        await field.save()
        return field
    }
    async destroy({params}){
        const field = ListField.findOrFail(params.id)
        await field.delete()
    }
}

module.exports = ListFieldController
