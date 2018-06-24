'use strict';

const Ticket = use('App/Models/Ticket');

class TicketFindFail
{
	
	async handle({request, response, params}, next)
	{
		
		const {
			relations = "false"
		} = request.all();
		
		// try to find the ticket from the database
		let ticket = null;
		
		if (relations === "true")
		{
			ticket = await Ticket.with(['assignee', 'sprint', 'release']).find(params.ticketId);
		}
		else
		{
			ticket = await Ticket.find(params.ticketId);
		}
		
		// check for the ticket
		if (ticket === null || ticket.hasOwnProperty("deleted_at"))
		{
			
			// return 400 response with the message, if the ticket does not exists.
			return response.status(404).json({
				status: "ERROR",
				message: `Ticket with the id of ${params.ticketId} could not be found.`
			});
		}
		
		// add the ticket object to the request body.
		request.body.ticket = ticket;
		
		// carry on with the request.
		await next()
		
	}
}

module.exports = TicketFindFail;
