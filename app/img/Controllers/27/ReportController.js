'use strict'
const Lead = use('App/Models/Lead')
const moment = require('moment')
class ReportController {
    async reports(){
		const now = moment().format('YYYY-MM-DD')
		// const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
		// const endOfMonth   = moment().endOf('month').format('YYYY-MM-DD');
        const data = {}
        data.total = await Lead.getCount()
		data.today = await Lead.query().where('created_at', 'like', now+'%').getCount()
		data.done =  await Lead.query().where('updated_at', 'like', now+'%').getCount()
		return data
	}
}

module.exports = ReportController
