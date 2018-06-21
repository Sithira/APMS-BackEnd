'use strict'

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const Factory = use('Factory');

class DataSeeder
{
	
	async run()
	{
		
		const users = await Factory.model('App/Models/User')
			.createMany(5);
		
		for (let i = 0; i < 2; i++)
		{
			const team = await Factory.model('App/Models/Team')
				.create();
			
			users[i].merge({_team_id: team._id});
			
			await users[i].save();
			
			const project = await Factory.model('App/Models/Project')
				.create();
			
			project.merge({_team_id: team._id});
			project.merge({_client_id: users[(i + 3)]._id});
			project.merge({_manager_id: users[(i + 1)]._id});
			
			await project.save();
			
			for (let j = 0; j < 2; j++)
			{
				
				const release = await Factory.model('App/Models/Release')
					.make();
				
				await project.releases().save(release);
				
			}
			
			
			for (let j = 0; j < 2; j++)
			{
				let sprint = await Factory.model('App/Models/Sprint').create();
				
				await project.sprints().save(sprint);
				
				for (let k = 0; k < 3; k++)
				{
					const ticket = await Factory.model('App/Models/Ticket').create();
					
					await sprint.tickets().save(ticket);
					
				}
				
			}
			
		}
		
		
	}
	
}

module.exports = DataSeeder;
