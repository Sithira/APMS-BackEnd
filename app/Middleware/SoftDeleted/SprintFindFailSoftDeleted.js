'use strict';

const _ = use('underscore');

class SprintFindFailSoftDeleted
{
	
	async handle({request, response, params}, next)
	{
		
		// init the variables form the body
		const {
			showAll = "false",
			pluck = "false"
		} = request.all();
		
		// get the project from the body
		let project = request.post().project,
			sprints = [];
		
		// lazy eager load relationship
		await project.load('sprints');
		
		// check for any projects
		if (project.$relations.sprints !== null)
		{
			// populate the sprints
			sprints = project.$relations.sprints.rows;
		}
		
		// show all records including deleted projects ( soft deleted )
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
		
		// filter only _id and name for sprint ( select populating purposes )
		if (pluck === "true")
		{
			sprints = _.map(sprints, (sprint) => {
				if (!sprint.hasOwnProperty("deleted_at"))
				{
					return {
						_id: sprint._id,
						name: sprint.name
					};
				}
			});
		}
		
		// add to the request body.
		request.body.sprints = sprints;
		
		// call next to advance the request
		await next()
	}
}

module.exports = SprintFindFailSoftDeleted;
