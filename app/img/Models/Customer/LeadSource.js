'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class LeadSource extends Model {
    static boot() {
        super.boot();
        this.addTrait( 'NoTimestamp' )
    }
    boards(){
        return this.belongsTo('App/Models/Board')
    }
}

module.exports = LeadSource
