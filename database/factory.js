'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

// const Factory = use('Factory')

/**
 Factory.blueprint('App/Models/User', (faker) => {
    return {
      username: faker.username()
    }
  })
 */

const Factory = use('Factory');

const Hash = use('Hash');

Factory.blueprint('App/Models/Team', async (faker) =>
{
	
	return {
		name: faker.name()
	}
	
});

Factory.blueprint('App/Models/User', async (faker, i, data) =>
{
	
	let type = "client";
	
	if (data.hasOwnProperty("type"))
	{
		type = data.type;
	}
	
	return {
		name: faker.name(),
		email: faker.email(),
		type: type,
		password: "sithira123"
	}
	
});

Factory.blueprint('App/Models/Project', async (faker) =>
{
	
	return {
		name: faker.word({length: 5}),
		description: faker.paragraph({ sentences: 1 }),
		start_date: faker.date(),
		end_date: faker.date()
	}
	
});


Factory.blueprint('App/Models/Sprint', async (faker) =>
{
	
	return {
		name: faker.word({length: 5}),
		description: faker.paragraph({ sentences: 1 }),
		start_date: faker.date(),
		end_date: faker.date()
	}
	
});


Factory.blueprint('App/Models/Release', async (faker) =>
{
	
	return {
		name: faker.word({length: 5}),
		number: faker.integer({min: -20, max: 20})
	}
	
});

Factory.blueprint('App/Models/Ticket', async (faker) =>
{
	
	return {
		
		name: faker.word({length: 5}),
		description: faker.paragraph({ sentences: 1 }),
		status: 1,
		severity_level: faker.integer({min: 1, max: 10}),
		priority: faker.integer({min: 1, max: 10}),
		last_modified_date: faker.timestamp(),
		
	};
	
});

Factory.blueprint('App/Models/Requirement', async (faker) =>
{
	
	return {
		name: faker.word(),
		description: faker.paragraph({ sentences: 1 })
	}
	
});


Factory.blueprint('App/Models/Ticket', async (faker) =>
{
	
	return {
		ticket_type: faker.word(),
		name: faker.word(),
		description: faker.paragraph({ sentences: 1 }),
		status: "STATUS",
		priority: faker.integer(),
		serverity_level: faker.integer(),
	}
	
});
