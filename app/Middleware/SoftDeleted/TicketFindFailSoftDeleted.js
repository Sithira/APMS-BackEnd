'use strict';

const _ = use('underscore');

class TicketFindFailSoftDeleted
{
	async handle({request}, next)
	{
		
		const {
			showAll = "false",
			pluck = "false",
			type = null
		} = request.all();
		
		let sprint = request.post().sprint,
			tickets;
		
		await sprint.load('tickets');
		
		tickets = await sprint.tickets().fetch();
		
		tickets = tickets.toJSON();
		
		// filter the ticket type from the array
		if (type !== null)
		{
			tickets = _.where(tickets, {
				ticket_type: type
			});
		}
		
		if (showAll === "true")
		{
			for (let i = 0; i < tickets.length; i++)
			{
				if (!tickets.hasOwnProperty("deleted_at"))
				{
					tickets.splice(i, 1);
				}
			}
		}
		
		if (pluck === "true")
		{
			
			tickets = _.map(tickets, (ticket) => {
				
				if (!ticket.hasOwnProperty("deleted_at"))
				{
					return {
						_id: ticket._id,
						name: ticket.name
					}
				}
				
			});
			
		}
		
		
		request.body.tickets = tickets;
		
		// call next to advance the request
		await next()
	}
}

module.exports = TicketFindFailSoftDeleted;
