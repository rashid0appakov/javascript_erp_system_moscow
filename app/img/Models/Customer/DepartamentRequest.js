'use strict'

const Model = use('Model')

class DepartamentRequest extends Model {
    departament(){
        return this.belongsTo('App/Models/Departament')
    }
    author(){
        return this.belongsTo('App/Models/User', 'author_user_id')
    }
    worker(){
        return this.belongsTo('App/Models/User', 'worker_user_id')
    }
    lead(){
        return this.belongsTo('App/Models/Lead')
    }
}

module.exports = DepartamentRequest
