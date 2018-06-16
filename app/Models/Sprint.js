'use strict'

const Model = use('Model');

class Sprint extends Model
{
	
	static get primaryKey()
	{
		return "_id";
	}
	
	static get objectIDs()
	{
		return ['_id', '_project_id'];
	}
	
	static boot()
	{
		super.boot();
		
		this.addHook('beforeDelete', 'SprintForceDelete.removeTickets');
	}
	
	/**
	 * Get the project that the phase is belongs to.
	 *
	 * @return {BelongsTo}
	 */
	project()
	{
		return this.belongsTo('App/Models/Project', '_project_id', '_id');
	}
	
	tickets()
	{
		return this.hasMany('App/Models/Ticket', '_id', '_sprint_id')
	}
	
}

module.exports = Sprint;
