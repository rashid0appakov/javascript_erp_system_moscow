'use strict'
const File = use('App/Models/File')
const Helpers = use('Helpers')
class FileController {
    async store( { request } ){
        const files = request.file('files')
        const data = request.only(['type', 'id', 'group'])
		const list = [];
		await files.moveAll(Helpers.publicPath('uploads/'+data.type+'/'+data.id), (file) => {
            const name = `${new Date().getTime()}.${file.extname}`
			list.push({
				fileable_id: data.id,
				fileable_type: data.type,
				name: file.clientName,
				group: data.group,
				type: file.extname,
				size: file.size,
				path: '/uploads/'+data.type+'/'+data.id+'/'+name
			})
			return { name }
		})
		if (!files.movedAll()) {
			const movedFiles = files.movedList()
			await Promise.all(movedFiles.map((file) => {
				return Drive.delete(file._location + '/' + file._fileName)
			}))
			return files.errors()
		}
		return await File.createMany(list)
    }
    async show( { params, response } ){
        const file = await File.findOrFail(params.id)
        response.attachment(Helpers.publicPath(file.path), file.name)
    }
    async destroy( { params } ){
        const file = await File.findOrFail(params.id)
        return await file.delete()
	}
}

module.exports = FileController
