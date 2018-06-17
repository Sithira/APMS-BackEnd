'use strict';

const Model = use('Model');

class Token extends Model
{
	
	static get primaryKey()
	{
		return "_id";
	}
	
	static get objectIDs()
	{
		return ['_id', '_user_id'];
	}
	
	/**
	 * Get the user that the token is belong to
	 *
	 * @return {BelongsTo}
	 */
	user()
	{
		return this.belongsTo('App/Models/User', '_user_id', '_id')
	}

}

module.exports = Token;
