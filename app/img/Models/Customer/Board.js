'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Board extends Model {
    static boot() {
        super.boot();
        this.addTrait( 'NoTimestamp' )
        this.addHook('beforeDelete', 'BoardHook.removeRelations')
    }
    leads(){
        return this.belongsToMany('App/Models/Lead').orderBy('sort')
    }
    lead_sources(){
        return this.hasMany('App/Models/LeadSource')
    }
}

module.exports = Board
