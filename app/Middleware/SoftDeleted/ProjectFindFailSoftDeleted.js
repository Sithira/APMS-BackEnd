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
			// wait for the projects to load
			await user.loadMany(['team.projects', 'owned_projects', 'managing_projects']);
			
			projects = {};
			
			let team = await user.team().fetch();
			
			// check for the team existence
			if (team)
			{
				// fetch the projects from team,
				let working_projects =  await team.projects().fetch();
				
				// add to the object if any rows exists
				if (working_projects.rows)
				{
					projects.working_projects = working_projects.toJSON();
				}
			}
			
			// lazy load owned projects
			let owned_projects = await user.owned_projects().fetch();
			
			// add only if any projects exists
			if (owned_projects.rows)
			{
				projects.owned_project = owned_projects.toJSON();
			}
			
			// lazy load managing projects
			let managing_projects = await user.managing_projects().fetch();
			
			// add only if we have any results
			if (managing_projects.rows)
			{
				projects.managing_projects = managing_projects.toJSON();
			}
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
		
		// add to the body
		request.body.projects = projects;
		
		await next()
	}
}

module.exports = ProjectFindFailSoftDeleted;
