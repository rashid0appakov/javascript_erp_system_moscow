'use strict'

class LeadStoreLeadType {
  get rules() {
    return {
      name: 'required|string|unique:lead_types,name'
    }
  }
  get messages() {
    return {
      'name.required': 'Обязательное поле',
      'name.string': 'Название типа должно быть строкой',
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

module.exports = LeadStoreLeadType
