'use strict'

const Hash = use('Hash'),
	Model = use('Model'),
	Team = use('App/Models/Team');


class User extends Model
{
	
	static get traits () {
		return [
			'@provider:Adonis/Acl/HasRole',
			'@provider:Adonis/Acl/HasPermission'
		]
	}
	
	static get hidden()
	{
		return ['password']
	}
	
	static get primaryKey()
	{
		return "_id";
	}
	
	static get objectIDs()
	{
		return ['_id', '_team_id'];
	}
	
	static boot()
	{
		super.boot();
		
		/**
		 * A hook to hash the user password before saving
		 * it to the database.
		 */
		this.addHook('beforeCreate', async (userInstance) =>
		{
			if (userInstance.password)
			{
				userInstance.password = await Hash.make(userInstance.password)
			}
		});
		
		this.addHook('beforeDelete', 'UserForceDeleteHook.removeProjects');
	}
	

	
	/**
	 * A relationship on tokens is required for auth to
	 * work. Since features like `refreshTokens` or
	 * `rememberToken` will be saved inside the
	 * tokens table.
	 *
	 * @method tokens
	 *
	 * @return {Object}
	 */
	tokens()
	{
		return this.hasMany('App/Models/Token', '_id', '_user_id')
	}
	
	/**
	 * Get the team of the user.
	 *
	 * @return {BelongsTo}
	 */
	team()
	{
		return this.belongsTo('App/Models/Team', '_team_id', '_id');
	}
	
	/**
	 * Projects that the user owns
	 *
	 * @return {HasMany}
	 */
	owned_projects()
	{
		return this.hasMany('App/Models/Project', '_id', '_client_id');
	}
	
	/**
	 * Get the projects that the user is managing.
	 *
	 * @return {HasMany}
	 */
	managing_projects()
	{
		return this.hasMany('App/Models/Project', '_id', '_manager_id');
	}
	
	/**
	 * Get the tickets that belongs to the user
	 *
	 * @return {HasMany}
	 */
	tickets()
	{
		return this.hasMany('App/Models/Ticket', '_id', '_assignee_id')
	}
	
	// roles()
	// {
	// 	return this.belongsToMany('Adonis/Acl/Role')
	// }
	
}

module.exports = User;
