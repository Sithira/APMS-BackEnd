'use strict';

const Sprint = use('App/Models/Sprint');

class SprintFindFailSoftDeleted {

    async handle({request, response, params}, next)
    {

        const {
            showAll = "false"
        } = request.all();

        let sprints = await Sprint.all();

        if (showAll === "false")
        {
            for (let i = 0; i < sprints.rows.length; i++)
            {

                if (sprints[i].$attributes.hasOwnProperty("deleted_at"))
                {
                    sprints.rows.splice(i, 1);
                }
            }
        }

        request.body.sprints = sprints;

        // call next to advance the request
        await next()
    }
}

module.exports = SprintFindFailSoftDeleted;
