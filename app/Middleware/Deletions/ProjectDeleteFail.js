'use strict';

const Project = use('App/Models/Project');

class ProjectDeleteFail
{
    async handle({ request, response, params }, next)
    {
        const {
            forceDestroy = "false"
        } = request.all();

        let projectId = request.post().project._id;

        let sprints = await Project.with(['sprints']).find(projectId);

        if (forceDestroy === "false")
        {

            let sprintsCount = await sprints.sprints().count();

            if (sprintsCount >= 1)
            {
                return response.status(400).json({
                    status: "ERROR",
                    message: `You have active ${sprintsCount} sprints on the projects.`
                })
            }
        }

        // call next to advance the request
        await next()
    }
}

module.exports = ProjectDeleteFail;
