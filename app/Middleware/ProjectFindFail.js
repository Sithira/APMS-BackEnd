'use strict';

const Project = use("App/Models/Project");

class ProjectFindFail
{
	
	async handle({request, response, params}, next)
	{
		
		const {
			forceDestroy = "false",
			relations = "false",
		} = request.all();
		
		let project = null;
		
		if (relations === "true")
		{
			project = await Project.with(['client', 'team']).find(params.projectId);
		}
		else
		{
			project = await Project.find(params.projectId)
		}
		
		// check for the project existence
		if (project === null || project === undefined || (forceDestroy === "false" && project.$attributes.hasOwnProperty("deleted_at")))
		{
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
