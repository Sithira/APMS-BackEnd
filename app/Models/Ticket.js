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
		return ['_id', '_sprint_id', '_assignee_id', '_release_id'];
	}
	
	/**
	 * Get the ticket that the sprint belongs to
	 *
	 * @return {BelongsTo}
	 */
	sprint()
	{
		return this.belongsTo('App/Models/Sprint', '_sprint_id', '_id');
	}
	
	/**
	 * Get the assignee that the ticket has been assign to.
	 *
	 * @return {BelongsTo}
	 */
	assignee()
	{
		return this.belongsTo('App/Models/User', '_assignee_id', '_id');
	}
	
	/**
	 * Get the release that the ticket belongs to
	 *
	 * @return {BelongsTo}
	 */
	release()
	{
		return this.belongsTo('App/Models/Release', '_release_id', '_id');
	}
	
}

module.exports = Ticket;
