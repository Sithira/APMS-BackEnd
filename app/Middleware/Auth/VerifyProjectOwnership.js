'use strict'

const User = use('App/Models/User');

const Team = use('App/Models/Team');

class VerifyProjectOwnership
{
	async handle({request, response, auth}, next, props)
	{
		
		// get the authenticated user
		let user = await auth.getUser();
		
		// check if the user is an admin, if true... dismiss all the checks
		if (user.type !== "admin")
		{
			
			// get the project from the request body
			const project = request.post().project;
			
			// get the request type in lower case, show that we can easy compare.
			const requestType = request.method().toLowerCase();
			
			// check the request type "POST or PATCH" for manger to edit it
			if (requestType === "post" || requestType === "patch")
			{
				
				// check for the manager property
				if (!project.hasOwnProperty("_manager_id"))
				{
					return response.status(403).json({
						status: "ERROR",
						type: "manager",
						message: `Unauthorized, You don't have required permissions to perform these actions`
					});
				}
				
				// let admins and project managers to edit the project.
				if (user._id.toString() !== project._manager_id.toString())
				{
					return response.status(403).json({
						status: "ERROR",
						type: "manager",
						message: `Unauthorized, You don't have required permissions to perform these actions`
					});
				}
				else
				{
					
					// return the request since, this is na PATCH situation.
					return await next();
				}
			}
			
			// check if the auth is the client of the project
			if (user.type === "client" || (props.indexOf("client") !== -1))
			{
				// check if the project's client is the person is authentication
				if (user._id.toString() !== project._client_id.toString())
				{
					return response.status(403).json({
						status: "ERROR",
						type: "client",
						message: `Unauthorized. You don't have permissions to access this content`
					});
				}
				else
				{
					// continue to the next request
					return await next();
				}
			}
			
			// check if the user if a developer of the project
			if (user.type === "developer" || (props.indexOf("developer") !== -1))
			{
				
				user = await User.with(['team']).find(user._id);
				
				if (user.$relations.team === null)
				{
					
					return response.status(403).json({
						status: "ERROR",
						message: `Unauthorized. You don't have permissions to access this content`
					});
				}
				else
				{
					
					let projects = await Team.with(['projects']).find(user._team_id);
					
					let bool = false;
					
					for (let i = 0; i < projects.$relations.projects.rows.length; i++)
					{
						
						if (projects.$relations.projects.rows[i]._id.toString() === project._id.toString())
						{
							bool = true;
						}
					}
					
					if (!bool)
					{
						
						return response.status(403).json({
							status: "ERROR",
							message: `Unauthorized. You don't have permissions to access this content`
						});
					}
					else
					{
						// continue to the next request
						return await next();
					}
					
				}
				
			}
			
			// check if the auth is a manager of the project
			if (user.type === "manager" || (props.indexOf("manager") !== -1))
			{
				if (user._id.toString() !== project._manager_id.toString())
				{
					return response.status(403).json({
						status: "ERROR",
						type: "manager",
						message: `Unauthorized, You don't have required permissions to perform these actions`
					});
				}
			}
			
		}
		
		// to the next part of the request
		await next();
		
	}
}

module.exports = VerifyProjectOwnership;
