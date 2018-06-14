'use strict';

const Sprint = use('App/Models/Sprint');

class SprintFindFail {

    async handle ({ request, response, params }, next)
    {

        const {
            forceDestroy = "false"
        } = request.all();

        // try to find the user from the database
        let sprint = await Sprint.find(params.sprintId);

        // check for the users
        if (sprint === null || sprint === undefined || (forceDestroy === "false" && sprint.$attributes.hasOwnProperty("deleted_at")))
        {
            // return 400 response with the message, if the user does not exists.
            return response.status(400).json({
                status: "ERROR",
                message: `Sprint with the id of ${params.sprintId} could not be found.`
            });
        }

        // add the user object to the request body.
        request.body.sprint = sprint;

        //console.log("Passing from middleware...");

        // carry on with the request.
        await next()

    }
}

module.exports = SprintFindFail;
