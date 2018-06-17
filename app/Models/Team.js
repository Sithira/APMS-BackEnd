'use strict';

const Model = use('Model');

class Team extends Model
{
	
	static get primaryKey()
	{
		return "_id";
	}
	
	/**
	 * Get all the users in a team.
	 *
	 * @return {HasMany}
	 */
	users()
	{
		return this.belongsToMany('App/Models/User', "_team_id", "_user_id")
			.pivotModel('App/Models/TeamUser');
	}
	
	/**
	 * Get all the projects that the team has assigned to.
	 *
	 * @return {HasMany}
	 */
	projects()
	{
		return this.hasMany("App/Models/Project", "_id", "_team_id");
	}
	
}

module.exports = Team;
