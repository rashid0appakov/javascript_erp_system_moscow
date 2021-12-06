'use strict'
class ForceJson {
  async handle ({ request }, next) {
    request.request.headers['accept'] = 'application/json'
    request.request.headers['Content-Type'] = 'multipart/form-data'
    await next()
  }
}

module.exports = ForceJson
