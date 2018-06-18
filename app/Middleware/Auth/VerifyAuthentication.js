'use strict';

class VerifyAuthentication
{
	
	async handle({request, response, auth}, next, props)
	{
		
		try
		{
			
			// get the user by authenticating the user with the JWT token
			let user = await auth.getUser();
			
			// if the user isn't an admin, check for the rest
			if (user.type !== "admin")
			{
				console.log("WFT ??");
				
				// if we have a prop for admin
				if (props.indexOf("admin") !== -1)
				{
					
					if (user.type !== "admin")
					{
						return response.status(401).json({
							status: "ERROR",
							type: "admin",
							message: "You don't have required permissions"
						});
					}
				}
				
				// if we have prop for a manager
				if (props.indexOf("manager") !== -1)
				{
					if (user.type !== "manager")
					{
						return response.status(401).json({
							status: "ERROR",
							type: "manager",
							message: "You don't have required permissions"
						});
					}
				}
				
				// if we have prop for a manager
				if (props.indexOf("developer") !== -1)
				{
					if (user.type !== "developer")
					{
						return response.status(401).json({
							status: "ERROR",
							type: "developer",
							message: "You don't have required permissions"
						});
					}
				}
				
				// if we have prop for a client
				if (props.indexOf("client") !== -1)
				{
					if (user.type !== "client")
					{
						return response.status(401).json({
							status: "ERROR",
							type: "client",
							message: "You don't have required permissions"
						});
					}
				}
			}
			
			// return for the next action.
			return await next();
		}
		catch (error)
		{
			console.log(error);
			
			return response.status(401).json({
				status: "ERROR",
				message: "Missing, Invalid or expired token. Please Re-Login"
			});
		}
		
	}
}

module.exports = VerifyAuthentication;
