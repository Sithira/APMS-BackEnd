'use strict';

const Sprint = use('App/Models/Sprint');

class SprintDeleteFail
{

    async handle({request, response, params}, next)
    {

        const {
            forceDestroy = "false"
        } = request.all();

        let sprintId = request.post().sprint._id;

        let tickets = await Sprint.with(['tickets']).find(sprintId);

        if (forceDestroy === "false")
        {
            const ticketCount = await tickets.tickets().count();

            if (ticketCount >= 1)
            {
                return response.status(400).json({
                    status: "ERROR",
                    message: `You have active ${ticketCount} tickets on the sprints`
                })
            }
        }

        // call next to advance the request
        await next()
    }
}

module.exports = SprintDeleteFail;
