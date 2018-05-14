'use strict';

const Model = use('Model');

class TicketType extends Model
{

    ticket()
    {
        return this.belongsTo('App/Models/Ticket');
    }

}

module.exports = TicketType;
