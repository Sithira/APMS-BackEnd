'use strict';

const Sprint = use('App/Models/Sprint');

class SprintFindFail
{
	
	async handle({request, response, params}, next)
	{
		
		const {
			forceDestroy = "false",
			relations = "false"
		} = request.all();
		
		// try to find the user from the database
		let sprint = null;
		
		if (relations === "true")
		{
			sprint = await Sprint.with(['tickets', 'project']).find(params.sprintId);
		}
		else
		{
			sprint = await Sprint.find(params.sprintId);
		}
		
		// check for the users
		if (sprint === null || sprint === undefined || (forceDestroy === "false" && sprint.$attributes.hasOwnProperty("deleted_at")))
		{
			// return 400 response with the message, if the user does not exists.
			return response.status(404).json({
				status: "ERROR",
				message: `Sprint with the id of ${params.sprintId} could not be found.`
			});
		}
		
		// add the user object to the request body.
		request.body.sprint = sprint;
		
		// carry on with the request.
		await next()
		
	}
}

module.exports = SprintFindFail;
