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
		
		const release = await Factory.model('App/Models/Release')
			.createMany(2);
		
		const users = await Factory.model('App/Models/User')
			.createMany(5);
		
		const team = await Factory.model('App/Models/Team')
			.createMany(2);
		
		const project = await Factory.model('App/Models/Project')
			.createMany(5);
		
		for (let i = 0; i < 5; i++)
		{
			
			for (let j = 0; j < 2; j++)
			{
				let sprint = await Factory.model('App/Models/Sprint').create();
				
				await project[i].sprints().save(sprint);
			}
			
		}
		
		const tickets = await Factory.model('App/Models/Ticket').createMany(5);
		
	}
	
}

module.exports = DataSeeder;
