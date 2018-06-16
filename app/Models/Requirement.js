'use strict';

const Model = use('Model');

class Requirement extends Model
{
	
	static get primaryKey()
	{
		return "_id";
	}
	
	project()
	{
		return this.hasOne('App/Models/Project', '_project_id', '_id');
	}
	
}

module.exports = Requirement;
