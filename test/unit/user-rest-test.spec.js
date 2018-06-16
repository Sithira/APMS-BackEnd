'use strict';

const Suite = use('Test/Suite')('Tickets R.E.S.T Test');

const {before, test, trait} = Suite;

trait('Test/ApiClient');

trait('Auth/Client');

const Factory = use('Factory');

let dummyUser = null,
	authUser = null;

before(async () =>
{
	// get an authenticated user.
	authUser = await Factory.model('App/Models/User')
		.create({type: "admin"});
});


test('New user can be created via the API', async ({client, assert}) =>
{
	
	// create a user temporary using the seeders
	const user = await Factory.model('App/Models/User')
		.make();
	
	// assign the user
	dummyUser = user;
	
	// check if the user is undefined.
	assert.notEqual(user, undefined);
	
	// send the request to the API to create the user from the API
	const response = await client.post('/api/v1/users')
		.loginVia(authUser, 'jwt')
		.send(user.$attributes)
		.end();
	
	// parse the json object
	let dataObject = JSON.parse(response._res.text);
	
	// get the userId
	dummyUser._id = dataObject.data._id;
	
	// check if we have the proper response from the API
	response.assertStatus(201);
	
	// from the response, explicitly access the data object and see if received an "OK" for the response.
	response.assertJSONSubset({status: "OK"});
	
});

test('Users can be fetched via the API', async ({client}) =>
{
	
	// get all the users from the database
	const response = await client.get('/api/v1/users')
		.loginVia(authUser, 'jwt')
		.end();
	
	// assert the response
	response.assertStatus(200);
	
	// assert for the JSON Object
	response.assertJSONSubset({
		data: [
			{
				name: dummyUser.$attributes.name
			}
		]
	})
	
});

test('A user can be updated via the API', async ({client}) =>
{
	
	// set the updating name
	let updatingName = "Updated Name";
	
	// assign it
	dummyUser.$attributes.name = updatingName;
	
	// make the request to the API
	const response = await client.patch('/api/v1/users/' + dummyUser.$attributes._id)
		.loginVia(authUser, 'jwt')
		.send(dummyUser.$attributes)
		.end();
	
	// check for the return status
	response.assertStatus(200);
	
	// check if the API return "OK" for the status
	response.assertJSONSubset({
		data: {
			name: updatingName
		}
	});
	
});

test('A user can be soft deleted via the API', async ({client}) =>
{
	
	// send the response to the server with correctly attached ids
	const response = await client.delete('/api/v1/users/' + dummyUser.$attributes._id + '?forceDestroy=false')
		.loginVia(authUser, 'jwt')
		.end();
	
	// check for the response
	response.assertStatus(200);
	
	// check if the API returned "OK" for the status
	response.assertJSONSubset({
		status: "OK"
	});
	
});

test('A user can be force deleted via the API', async ({client}) =>
{
	
	// send the response to the server with correctly attached ids
	const response = await client.delete('/api/v1/users/' + dummyUser.$attributes._id + '?forceDestroy=true')
		.loginVia(authUser, 'jwt')
		.end();
	
	// check for the response
	response.assertStatus(200);
	
	// check if the API returned "OK" for the status
	response.assertJSONSubset({
		status: "OK"
	});
	
});
