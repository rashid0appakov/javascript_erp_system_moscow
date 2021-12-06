'use strict'

const Model = use('Model')

class Task extends Model {
    static get dates() {
        return super.dates.concat(["expired_at"]);
    }
    user(){
        return this.belongsTo('App/Models/User', 'to_user_id', 'id')
    }
}

module.exports = Task
