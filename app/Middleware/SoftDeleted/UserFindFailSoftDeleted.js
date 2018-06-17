'use strict';

const User = use('App/Models/User');

class UserFindFailSoftDeleted
{
	async handle({request}, next)
	{
		
		// get all the users from the database
		let users = await User.all();
		
		let {
			showAll = "false",
		} = request.all();
		
		// if we need to see soft deleted users
		if (showAll === "false")
		{
			for (let i = 0; i < users.rows.length; i++)
			{
				if (users.rows[i].$attributes.hasOwnProperty("deleted_at"))
				{
					
					users.rows.splice(i, 1);
					
				}
			}
		}
		
		request.body.users = users;
		
		// call next to advance the request
		await next()
	}
}

module.exports = UserFindFailSoftDeleted
