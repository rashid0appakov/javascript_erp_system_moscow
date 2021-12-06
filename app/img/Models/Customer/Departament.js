'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Departament extends Model {
    static boot() {
        super.boot();
        this.addTrait('NoTimestamp')
    }
    fields(){
        return this.hasMany('App/Models/DepartamentField')
    }
    users(){
        return this.belongsToMany('App/Models/User').withPivot('access')
    }
    teams(){
        return this.hasMany('App/Models/Team')
    }
    boards(){
        return this.hasMany('App/Models/Board').orderBy('sort')
    }
    children(){
        return this.hasMany('App/Models/Departament', 'parent_id')
    }
    requests(){
        return this.hasMany('App/Models/DepartamentRequest')
    }
}

module.exports = Departament
