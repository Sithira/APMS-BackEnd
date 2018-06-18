'use strict'

const Team = use('App/Models/Team');

class TeamFindFromBody
{
	async handle({request, response}, next)
	{
		
		const {
			_team_id
		} = request.all();
		
		if (_team_id === undefined || _team_id === null)
		{
			return response.status(404).json({
				status: 'ERROR',
				message: `No TeamId found.`
			});
		}
		
		let team = await Team.find(_team_id);
		
		if (team === null && team.$attributes.hasOwnProperty("deleted_at"))
		{
			return response.status(404).json({
				status: 'ERROR',
				message: `No with team id: ${_team_id} has been removed or does not exists`
			});
		}
		
		// add the request to the body.
		request.body.team = team;
		
		// call next to advance the request
		await next()
	}
}

module.exports = TeamFindFromBody;
