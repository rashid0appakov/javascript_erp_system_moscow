'use strict'
const Drive = use('Drive')
const Helpers = use('Helpers')
const FileHook = exports = module.exports = {}

FileHook.removeFile = async (modelInstance) => {
    await Drive.delete(Helpers.publicPath(modelInstance.path))
}
