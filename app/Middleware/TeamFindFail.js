'use strict';

const Team = use('App/Models/Team');

class TeamFindFail
{
    async handle({request, response, params}, next)
    {

        // get the flags
        const {
            relations = "false"
        } = request.all();

        // define the variable for the team
        let team = null;

        // check for request for the members
        if (relations === "true")
        {
            // load the relationship with users.
            team = await Team.with(['users', 'projects']).find(params.teamId);
        }
        else
        {
            team = await Team.find(params.teamId);
        }

        // check if the team exists or team has been soft deleted
        if (team === null || team.$attributes.hasOwnProperty("deleted_at"))
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
