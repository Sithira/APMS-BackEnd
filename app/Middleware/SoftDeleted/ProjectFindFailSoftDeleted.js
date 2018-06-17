'use strict';

const Project = use('App/Models/Project');

class ProjectFindFailSoftDeleted
{
	
	async handle({request, response, params, auth}, next)
	{
		let projects = null;
		
		let user = await auth.getUser();
		
		// wait for the projects to load
		await user.load('team.projects');
		
		if (user.type.toString() === "admin")
		{
			projects = await Project.all();
		}
		else
		{
			projects = user.$relations.team.$relations.projects.rows;
		}
		
		let {
			showAll = "false",
		} = request.all();
		
		if (showAll === "false")
		{
			for (let i = 0; i < projects.length; i++)
			{
				if (projects[i].$attributes.hasOwnProperty("deleted_at"))
				{
					
					projects.splice(i, 1);
					
				}
			}
		}
		
		request.body.projects = projects;
		
		await next()
	}
}

module.exports = ProjectFindFailSoftDeleted;
