'use strict';

const Team = use('App/Models/Team');

class TeamFindFailSoftDeleted {

    async handle({request, response, params}, next) {

        const {
            showAll = "false"
        } = request.all();

        let teams = await Team.all();

        if (showAll === "false")
        {
            for (let i = 0; i < teams.rows.length; i++)
            {

                if (teams.rows[i].$attributes.hasOwnProperty("deleted_at"))
                {

                    teams.rows.splice(i, 1);

                }
            }
        }

        request.body.teams = teams;

        // call next to advance the request
        await next()
    }
}

module.exports = TeamFindFailSoftDeleted;
