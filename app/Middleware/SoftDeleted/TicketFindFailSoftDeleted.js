'use strict';

class TicketFindFailSoftDeleted
{
    async handle({request}, next)
    {



        // call next to advance the request
        await next()
    }
}

module.exports = TicketFindFailSoftDeleted;
