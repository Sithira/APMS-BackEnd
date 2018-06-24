'use strict';

const User = use('App/Models/User');

const _ = use('underscore');

class UserFindFailSoftDeleted
{
	async handle({request}, next)
	{
		
		let {
			showAll = "false",
			pluck = "false",
			type = null
		} = request.all();
		
		// get all the users from the database
		let users = await User.all();
		
		users = users.toJSON();
		
		// if we need to see soft deleted users
		if (showAll === "false")
		{
			for (let i = 0; i < users.length; i++)
			{
				if (users[i].hasOwnProperty("deleted_at"))
				{
					
					users.splice(i, 1);
					
				}
			}
		}
		
		
		// filter the user type from the array
		if (type !== null)
		{
			users = _.where(users, {
				type: type
			});
		}
		
		// pluck _id and name from the array
		if (pluck === "true")
		{
			users = _.map(users, (user, key) =>
			{
				
				if (showAll === "false")
				{
					users.slice(key);
				}

				return {
					_id: user._id,
					name: user.name
				};
				
			});
		}
		
		request.body.users = users;
		
		// call next to advance the request
		await next()
	}
}

module.exports = UserFindFailSoftDeleted;
