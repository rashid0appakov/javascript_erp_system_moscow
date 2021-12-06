'use strict'
const MessageHook = exports = module.exports = {}

MessageHook.method = async (modelInstance) => {
    await modelInstance.files().delete()
}
