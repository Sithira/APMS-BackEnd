'use strict';

const User = use('App/Models/User');

const Project = use('App/Models/Project');

class VerifyTicket
{
	
	async handle({request, response, auth}, next, props)
	{
		
		// get the authenticated user.
		let user = await auth.getUser();
		
		// get the project with the manager
		let project = await Project.with(['manager']).find(request.post().project._id);
		
		// get the user with attributes.
		user = await User.with(['tickets']).find(user._id);
		
		// init the variables and get tickets from body
		let ticket = request.post().ticket,
			ticketFound = false,
			tickets = user.$relations.tickets.rows;
		
		// allow for admins and mangers only
		if (user.type !== 'admin')
		{
			
			// if the ticket is assigned to auth'ed user, continue the request
			if (user._id.toString() === ticket._assignee_id.toString())
			{
				return await next();
			}
			
			// get the request type.
			let requestType = request.method().toLowerCase();
			
			// check manager for POST and PATCH
			if (requestType === "post" || requestType === "patch")
			{
				
				// if the manager is null, current auth'ed user
				if (project.$relations.manager === null)
				{
					return response.status(401).json({
						status: "ERROR",
						message: `You don't have enough permissions to do the requested action`
					});
				}
				
				// if the auth'ed user is not the project manager
				if (user._id.toString() !== project.$relations.manager._id.toString())
				{
					return response.status(401).json({
						status: "ERROR",
						message: `You don't have enough permissions to do the requested action`
					})
				}
				else
				{
					return await next();
				}
			}
			
			
			// check for any tickets
			if (tickets.length >= 1)
			{
				
				// loop through every ticket and
				for (let i = 0; i < tickets.length; i++)
				{
					if (tickets[i]._id.toString() === ticket._id.toString())
					{
						ticketFound = true;
					}
				}
			}
			
			if (!ticketFound)
			{
				return response.status(401).json({
					status: "ERROR",
					message: `You don't have permissions to access this ticket.`
				})
			}
		}
		
		await next()
	}
}

module.exports = VerifyTicket;
