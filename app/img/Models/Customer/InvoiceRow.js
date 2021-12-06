'use strict'

const Model = use('Model')

class InvoiceRow extends Model {
    static boot() {
        super.boot();
        this.addTrait('NoTimestamp')
    }
}

module.exports = InvoiceRow
