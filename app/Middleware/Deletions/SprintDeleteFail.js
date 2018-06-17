'use strict';

const Sprint = use('App/Models/Sprint');

class SprintDeleteFail
{
	
	async handle({request, response, params}, next)
	{
		
		const {
			forceDestroy = "false"
		} = request.all();
		
		let sprint = request.post().sprint;
		
		await sprint.load('tickets');
		
		let tickets = sprint.$relations.tickets.rows;
		
		if (forceDestroy === "false")
		{
			const ticketCount = tickets.length;
			
			if (ticketCount >= 1)
			{
				return response.status(400).json({
					status: "ERROR",
					message: `You have active ${ticketCount} tickets on the sprint`
				})
			}
		}
		
		// call next to advance the request
		await next()
	}
}

module.exports = SprintDeleteFail;
