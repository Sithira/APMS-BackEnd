'use strict';

const Ticket = use('App/Models/Ticket');

class TicketController
{

    async index({request, response})
    {



        const tickets = await Ticket
            .query()
            .with('project')
            .where('_project_id', request._project_id)
            .fetch();

        return response.status(200).json({
            status: "OK",
            data: tickets
        });

    }

    async store({request, response})
    {



    }


}

module.exports = TicketController;
