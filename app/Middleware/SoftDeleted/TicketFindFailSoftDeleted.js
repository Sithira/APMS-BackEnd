'use strict';

class TicketFindFailSoftDeleted
{
	async handle({request}, next)
	{
		
		let sprint = request.post().sprint,
			tickets = [];
		
		await sprint.load('tickets');
		
		if (sprint.$relations.tickets !== null)
		{
			tickets = sprint.$relations.tickets.rows;
		}
		
		console.log(tickets);
		
		request.body.tickets = tickets;
		
		// call next to advance the request
		await next()
	}
}

module.exports = TicketFindFailSoftDeleted;
