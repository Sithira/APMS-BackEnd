'use strict';

const Team = use('App/Models/Team');

class TeamFindFail
{
    async handle({request, response, params}, next)
    {

        let team = await Team.find(params.teamId);

        if (team === null)
        {
            return response.status(400).json({
                status: "ERROR",
                message: `A Team with id ${params.teamId} could not be found.`
            });
        }

        request.body.team = team;

        // call next to advance the request
        await next()
    }
}

module.exports = TeamFindFail;
