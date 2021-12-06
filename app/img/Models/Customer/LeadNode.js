'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class LeadNode extends Model {
    board(){
        return this.belongsTo('App/Models/Board')
    }
    user(){
        return this.belongsTo('App/Models/User')
    }
}

module.exports = LeadNode
