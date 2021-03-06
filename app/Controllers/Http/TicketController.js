'use strict';

const Ticket = use('App/Models/Ticket');

class TicketController
{
	
	/**
	 * Get all tickets that belongs to a project -> sprint
	 *
	 * @param request
	 * @param response
	 * @return {Promise<*|{limit, strict, types}|Promise<any>>}
	 */
	async index({request, response})
	{
		
		// get all tickets from the database.
		const tickets = request.post().tickets;
		
		// return the details
		return response.status(200).json({
			status: "OK",
			data: tickets
		})
		
	}
	
	/**
	 * Get the ticket and show it
	 *
	 * @param request
	 * @param response
	 * @return {Promise<*|{limit, strict, types}|Promise<any>>}
	 */
	async show({request, response})
	{
		
		const ticket = request.post().ticket;
		
		return response.status(200).json({
			status: "OK",
			data: ticket
		})
		
	}
	
	async store({request, response})
	{
		
		const sprint = request.post().sprint;
		
		const ticket = await Ticket.create(request.except(['project', 'sprint']));
		
		await sprint.tickets().save(ticket);
		
		return response.status(201).json({
			status: "OK",
			data: ticket
		})
		
	}
	
	async update({request, response})
	{
		
		let ticket = request.post().ticket;
		
		ticket.merge(request.except(['sprint', '_sprint_id', 'assignee', '_assignee_id', 'release', '_release_id']));
		
		await ticket.save();
		
		return response.status(200).json({
			status: "OK",
			data: ticket
		})
		
	}
	
	async destroy({request, response})
	{
		
		const ticket = request.post().ticket;
		
		let ticketId = ticket._id;
		
		const {forceDestroy = "false"} = request.all();
		
		if (forceDestroy === "true")
		{
			await ticket.delete();
			
			return response.status(200).json({
				status: "OK",
				message: `The ticket with the id: ${ticketId} has been force deleted`
			});
		}
		else
		{
			
			// set the deleted_at field
			const softDelete = {
				deleted_at: new Date().toISOString()
			};
			
			ticket.merge(softDelete);
			
			await ticket.save();
			
			return response.status(200).json({
				status: "OK",
				message: `The ticket with the id: ${ticketId} has been successfully soft deleted`
			})
			
		}
		
	}
	
}

module.exports = TicketController;
