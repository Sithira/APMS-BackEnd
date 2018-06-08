'use strict';

class SprintDeleteFail
{
  async handle ({ request }, next)
  {
    // call next to advance the request
    await next()
  }
}

module.exports = SprintDeleteFail;
