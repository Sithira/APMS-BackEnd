'use strict';

const Model = use('Model');

class TicketType extends Model
{
	
	static get primaryKey()
	{
		return "_id";
	}
	
	
	ticket()
	{
		return this.belongsTo('App/Models/Ticket');
	}
	
}

module.exports = TicketType;
