'use strict';

const Project = use('App/Models/Project');

const _ = use('underscore');

class ProjectFindFailSoftDeleted
{
	
	async handle({request, response, params, auth}, next)
	{
		
		let {
			showAll = "false",
			pluck = "false"
		} = request.all();
		
		
		let projects = null;
		
		// get the authenticated user
		let user = await auth.getUser();
		
		// wait for the projects to load
		await user.load('team.projects');
		
		// query all relationships if the user is an admin.
		if (user.type.toString() === "admin")
		{
			// get all the rows
			projects = await Project.all();
			
			// and convert them to
			projects = projects.toJSON();
		}
		else
		{
			// fetch the projects that are belogn to a user with auth
			projects = user.projects().fetch().toJSON();
		}
		
		// show all records ( soft deleted )
		if (showAll === "false")
		{
			
			for (let i = 0; i < projects.length; i++)
			{
				
				if (projects[i].hasOwnProperty("deleted_at"))
				{
					projects.splice(i, 1);
					
				}
			}
		}
		
		// pluck _id and name of the project for dropdown
		if (pluck === 'true')
		{
			
			projects = _.map(projects, (project) => {
				return {
					_id: project._id,
					name: project.name
				}
			});
			
		}
		
		
		request.body.projects = projects;
		
		await next()
	}
}

module.exports = ProjectFindFailSoftDeleted;
