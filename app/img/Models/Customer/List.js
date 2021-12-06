'use strict'

const Model = use('Model')

class List extends Model {
    list_fields(){
        return this.hasMany('App/Models/ListField')
    }
    list_rows(){
        return this.hasMany('App/Models/ListRow')
    }
}

module.exports = List
