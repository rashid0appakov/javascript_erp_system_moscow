'use strict'
const Drive = use('Drive')
const Helpers = use('Helpers')
const LeadHook = exports = module.exports = {}

LeadHook.removeRelations = async (modelInstance) => {
    await modelInstance.messages().delete()
    await modelInstance.files().delete()
    await Drive.delete(Helpers.publicPath('/uploads/leads/'+modelInstance.id))
}
