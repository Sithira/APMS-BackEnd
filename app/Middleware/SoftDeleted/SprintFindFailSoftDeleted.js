'use strict'

class SprintFindFailSoftDeleted {
  async handle ({ request }, next) {
    // call next to advance the request
    await next()
  }
}

module.exports = SprintFindFailSoftDeleted
