'use strict'

class LeadStoreLeadStatus {
  get rules() {
    return {
      name: 'required|string|unique:lead_statuses,name'
    }
  }
  get messages() {
    return {
      'name.required': 'Обязательное поле',
      'name.string': 'Название статуса должно быть строкой',
      'name.unique': 'Это название уже используется'
    }
  }
  get validateAll() {
    return true
  }
  async fails(errorMessages) {
    return this.ctx.response.status(422).json(errorMessages)
  }
}

module.exports = LeadStoreLeadStatus
