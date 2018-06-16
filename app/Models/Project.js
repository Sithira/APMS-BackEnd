'use strict';

const Model = use('Model');

class Project extends Model
{
	
	static get primaryKey()
	{
		return "_id";
	}
	
	static get objectIDs()
	{
		return ['_id', '_client_id', '_manager_id', '_team_id'];
	}
	
	static boot()
	{
		super.boot();
		
		// mongoDB hook for delete associates sprints.
		this.addHook('beforeDelete', 'ProjectForceDelete.removeSprints');
		
		// mongoDB hook for delete associated releases.
		this.addHook('beforeDelete', 'ProjectForceDelete.removeReleases');
	}
	
	/**
	 * Return the manager that belong to the project
	 *
	 * @returns {HasOne}
	 */
	manager()
	{
		return this.hasOne("App/Models/User", "_manager_id", "_id");
	}
	
	/**
	 * Get the client for the project
	 *
	 * @return {BelongsTo}
	 */
	client()
	{
		return this.belongsTo("App/Models/User", "_client_id", "_id");
	}
	
	/**
	 * Get the Phases of a project
	 *
	 * @return {HasMany}
	 */
	sprints()
	{
		return this.hasMany('App/Models/Sprint', '_id', '_project_id')
	}
	
	/**
	 * Get the project version
	 *
	 * @return {HasMany}
	 */
	releases()
	{
		return this.hasMany('App/Models/Release', '_id', '_project_id');
	}
	
	/**
	 * Get the team that the project has been assigned to
	 *
	 * @return {HasOne}
	 */
	team()
	{
		return this.hasOne('App/Models/Team', '_team_id', '_id');
	}
	
}

module.exports = Project;
