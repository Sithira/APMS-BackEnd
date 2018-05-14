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

        // get the sprint because ticket belongs to a sprint
        const sprint = request.post().sprint;

        // get all tickets from the database.
        const tickets = await Ticket.query()
            .where('_sprint_id', sprint._id)
            .fetch();

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

        const ticket = request.post().ticket;



    }

    async update({request, response})
    {

    }

    async destroy({request, response})
    {

    }

}

module.exports = TicketController;
