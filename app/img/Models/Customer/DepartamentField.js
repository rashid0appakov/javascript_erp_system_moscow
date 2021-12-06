'use strict'

const Model = use('Model')

class DepartamentField extends Model {
	static boot() {
        super.boot();
        this.addTrait('NoTimestamp')
    }
}

module.exports = DepartamentField
