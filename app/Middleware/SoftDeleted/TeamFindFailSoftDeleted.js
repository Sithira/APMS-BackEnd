'use strict';

const Team = use('App/Models/Team');

const _ = use('underscore');

class TeamFindFailSoftDeleted
{
	
	async handle({request, response, params}, next)
	{
		
		const {
			showAll = "false",
			pluck = "false"
		} = request.all();
		
		let teams = await Team.all();
		
		teams = teams.toJSON();
		
		if (showAll === "false")
		{
			for (let i = 0; i < teams.length; i++)
			{
				
				if (teams[i].hasOwnProperty("deleted_at"))
				{
					
					teams.splice(i, 1);
					
				}
			}
		}
		
		if (pluck === "true")
		{
			teams = _.map(teams, (team) => {
				
				if (!team.hasOwnProperty("deleted_at"))
				{
					return {
						_id: team._id,
						name: team.name
					};
				}
				
			});
		}
		
		request.body.teams = teams;
		
		// call next to advance the request
		await next()
	}
}

module.exports = TeamFindFailSoftDeleted;
