'use strict';

const Project = use("App/Models/Project");

class ProjectFindFail {

    async handle({request, response, params}, next) {

        const {
            forceDestroy = "false"
        } = request.all();

        // get the project from the database.
        const project = await Project.find(params.projectId);

        // check for the project existence
        if (project === null || (forceDestroy === "false" && project.$attributes.hasOwnProperty("deleted_at"))) {
            // return the error response.
            return response.status(400).json({
                status: "ERROR",
                message: `Project with the id: ${params.projectId} could not be found !`
            });
        }

        // attach the project object to the body.
        request.body.project = project;

        // call next to advance the request
        await next()
    }
}

module.exports = ProjectFindFail;
