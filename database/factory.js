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

Factory.blueprint('App/Models/User', async (faker) => {

    return {
        name: faker.name(),
        email: faker.email(),
        password: Hash.make("sithira")
    }

});

Factory.blueprint('App/Models/Project', async (faker) => {

    return {
        name: faker.word(),
        description: faker.paragraph(),
        _client_id: faker.string(),
        _team_id: faker.string(),
    }

});


Factory.blueprint('App/Models/Sprint', async (faker) => {

    return {
        name: faker.word(),
        description: faker.paragraph(),
        start_date: faker.date(),
        end_date: faker.date()
    }

});
