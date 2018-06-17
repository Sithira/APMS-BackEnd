'use strict';

const Project = use('App/Models/Project');

class ProjectDeleteFail
{
	async handle({request, response, params}, next)
	{
		const {
			forceDestroy = "false"
		} = request.all();
		
		let project = request.post().project;
		
		await project.load('sprints');
		
		let sprints = project.$relations.sprints.rows;
		
		if (forceDestroy === "false")
		{
			
			let sprintsCount = sprints.length;
			
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
