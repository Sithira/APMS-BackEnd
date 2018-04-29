'use strict'

const { test, trait } = use('Test/Suite')('User')

const User = use('App/Models/User');

trait('Test/ApiClient');

test('Get all the users from the database.', async ({ client }) => {

    const response = await client.get('/api/v1/users').end()

    response.assertStatus(200);

})
