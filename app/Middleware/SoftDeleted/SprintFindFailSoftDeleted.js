'use strict';

const Sprint = use('App/Models/Sprint');

class SprintFindFailSoftDeleted
{
	
	async handle({request, response, params}, next)
	{
		
		let project = request.post().project,
		sprints = [];
		
		await project.load('sprints');
		
		const {
			showAll = "false"
		} = request.all();
		
		if (project.$relations.sprints !== null)
		{
			sprints = project.$relations.sprints.rows;
		}
		
		if (showAll === "false")
		{
			for (let i = 0; i < sprints.length; i++)
			{
				
				if (sprints[i].$attributes.hasOwnProperty("deleted_at"))
				{
					sprints[i].splice(i, 1);
				}
			}
		}
		
		request.body.sprints = sprints;
		
		// call next to advance the request
		await next()
	}
}

module.exports = SprintFindFailSoftDeleted;
