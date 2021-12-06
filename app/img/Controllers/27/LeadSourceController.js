'use strict'
const LeadSource = use('App/Models/LeadSource')
class LeadSourceController {
    async store({request}){
        return await LeadSource.create(request.all())
    }
    async update({params, request}){
        const source = await LeadSource.findOrFail(params.id)
        source.merge(request.all())
        await source.save()
    }
    async destroy({params}){
        const source = await LeadSource.findOrFail(params.id)
        await source.delete()
    }
}

module.exports = LeadSourceController
