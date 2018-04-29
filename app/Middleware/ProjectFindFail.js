'use strict';

const Project = use("Project");

class ProjectFindFail
{

  async handle ({ request, response, params }, next)
  {

    // get the project from the database.
    const project = await Project.find(params.id);

    // check for the project existence
    if (project === null)
    {
        // return the error response.
        return response.status(400).json({
            status: "ERROR",
            message: `Project with the id: ${params.id} could not be found !`
        });
    }

    // attach the project object to the body.
    request.body.project = project;

    // call next to advance the request
    await next()
  }
}

module.exports = ProjectFindFail;
