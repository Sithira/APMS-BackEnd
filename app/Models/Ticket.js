'use strict';

const Model = use('Model');

class Ticket extends Model
{

    static get primaryKey()
    {
        return "_id";
    }

    static get objectIDs()
    {
        return ['_id', '_sprint_id'];
    }

    /**
     * Get the projects belongs to the ticket
     *
     * @return {BelongsTo}
     */
    project()
    {
        return this.belongsTo('App/Models/Project', '_project_id', '_id');
    }

    /**
     * Get the ticket type of the user
     *
     * @return {BelongsTo}
     */
    ticketType()
    {
        return this.belongsTo('App/Models/TicketType', '_ticket_typ_id', '_id');
    }

}

module.exports = Ticket;
