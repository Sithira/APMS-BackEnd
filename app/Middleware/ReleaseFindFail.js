'use strict';

const Release = use('App/Models/Release');

class ReleaseFindFail
{
	
	async handle({request, response, params}, next)
	{
		
		// try to find the user from the database
		let release = await Release.find(params.releaseId);
		
		// check for the users
		if (release === null)
		{
			
			// return 400 response with the message, if the user does not exists.
			return response.status(400).json({
				status: "ERROR",
				message: `Release with the id of ${params.releaseId} could not be found.`
			});
		}
		
		// add the user object to the request body.
		request.body.release = release;
		
		// carry on with the request.
		await next()
		
	}
}

module.exports = ReleaseFindFail;
