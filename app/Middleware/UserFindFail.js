'use strict'

const User = use("App/Models/User");

const Team = use("App/Models/Team");

class UserFindFail
{
	
	async handle({request, response, params}, next)
	{
		
		const {
			relations = "false",
		} = request.all();
		
		// try to find the user from the database
		let user = null;
		
		// Loads all of the relationships associated with the user.
		if (relations === "true")
		{
			user = await User.with(['team', 'owned_projects', 'managing_projects']).find(params.userId);
			
			if (user.$relations.team)
			{
				let team = await Team.with(['projects']).find(user.$relations.team.$attributes._id);
				
				user.$relations['projects'] = team.$relations.projects;
				
			}
		}
		else
		{
			user = await User.find(params.userId);
		}
		
		// check for the users
		if (user === null)
		{
			
			// return 400 response with the message, if the user does not exists.
			return response.status(400).json({
				status: "ERROR",
				message: `User with the id of ${params.userId} could not be found.`
			});
		}
		
		// add the user object to the request body.
		request.body.user = user;
		
		// carry on with the request.
		await next()
		
	}
}

module.exports = UserFindFail;
