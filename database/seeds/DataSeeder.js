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

  async run ()
  {

    const release = await Factory.model('App/Models/Release')
        .createMany(2);

    const users = await Factory.model('App/Models/User')
        .createMany(5);

    const team = await Factory.model('App/Models/Team')
        .createMany(2);

    const project = await Factory.model('App/Models/Project')
        .createMany(5);

  }

}

module.exports = DataSeeder;
