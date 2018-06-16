'use strict';

class ProfileController
{
	
	async index({request, response, auth})
	{
		
		try
		{
			let user = await auth.getUser();
			
			return response.status(200).json({
				status: "OK",
				authentication: "AUTHENTICATED",
				data: user
			})
		}
		catch (err)
		{
			return response.status(302).json({
				status: "ERROR",
				message: "Please Re-Login"
			})
		}
		
	}
	
}

module.exports = ProfileController;
