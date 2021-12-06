'use strict'

const BoardHook = exports = module.exports = {}

BoardHook.removeRelations = async (modelInstance) => {
    await modelInstance.leads().delete()
}
