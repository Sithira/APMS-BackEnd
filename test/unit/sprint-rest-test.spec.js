'use strict';

const Suite = use('Test/Suite')('Sprint R.E.S.T Test');

const {before, test, trait} = Suite;

trait('Test/ApiClient');

trait('Auth/Client');

const Factory = use('Factory');

let authUser = null;

let dummyProject = null;

let dummySprint = null;

let dummyTeam = null;


before(async () =>
{
	// get an authenticated user.
	authUser = await Factory.model('App/Models/User')
		.create({type: "admin"});
});


test('Add sprint to a existing project', async ({client}) =>
{
	
	// mock an object in the memory
	const project = await Factory.model('App/Models/Project')
		.make();
	
	// create an team
	const team = await Factory.model('App/Models/Team')
		.make();
	
	// add the client_id to the attributes
	project.$attributes['_client_id'] = authUser._id;
	project.$attributes['_manager_id'] = authUser._id;
	
	// hit the API tp save the team
	const responseTeam = await client.post('/api/v1/teams')
		.loginVia(authUser, 'jwt')
		.send(team.$attributes)
		.end();
	
	// parse to JSON
	dummyTeam = (JSON.parse(responseTeam.text)).data;
	
	// append to the project attributes
	project.$attributes['_team_id'] = dummyTeam._id;
	
	// using it's data, we send a request to the API server.
	const response = await client.post('/api/v1/projects')
		.loginVia(authUser, 'jwt')
		.send(project.$attributes)
		.end();
	
	dummyProject = (JSON.parse(response.text)).data;
	
	// status of 201 will be return upon success
	response.assertStatus(201);
	
	// check if the returned data matches the prev mocked object
	response.assertJSONSubset({
		status: "OK", // check if we have a status of "OK"
		data: {
			name: project.$attributes.name
		}
	});
	
	// mock the object in the memory
	const sprint = await Factory.model('App/Models/Sprint')
		.make();
	
	sprint.$attributes._project_id = dummyProject._id;
	
	// create the actual instance visa the API. ( sprint )
	const responseSprint = await client.post('/api/v1/projects/' + dummyProject._id + '/sprints')
		.loginVia(authUser, 'jwt')
		.send(sprint.$attributes)
		.end();
	
	dummySprint = (JSON.parse(responseSprint.text)).data;
	
	responseSprint.assertStatus(201);
	
	responseSprint.assertJSONSubset({
		status: "OK"
	});
	
});


test('Create sprint can be fetched via the API for a given project', async ({client}) =>
{
	
	const response = await client.get('/api/v1/projects/' + dummyProject._id + '/sprints')
		.loginVia(authUser, 'jwt')
		.end();
	
	response.assertStatus(200);
	
	response.assertJSONSubset({
		data: [{
			name: dummySprint.name
		}]
	});
	
});


test("A Sprint can be updated via the API.", async ({client}) =>
{
	
	dummySprint.name = "Some updated sprint name";
	
	const response = await client.patch('/api/v1/projects/' + dummyProject._id + '/sprints/' + dummySprint._id)
		.loginVia(authUser, 'jwt')
		.send(dummySprint)
		.end();
	
	response.assertStatus(200);
	
	response.assertJSONSubset({
		data: {
			name: dummySprint.name
		}
	});
	
});


test('A Sprint can be soft deleted deleted via the API', async ({client}) =>
{
	
	const response = await client.delete('/api/v1/projects/' + dummyProject._id + '/sprints/' + dummySprint._id)
		.loginVia(authUser, 'jwt')
		.end();
	
	response.assertStatus(200);
	
	response.assertJSONSubset({
		status: "OK"
	});
	
});


test('A Sprint can be force deleted via the API', async ({client}) =>
{
	
	const response = await client.delete('/api/v1/projects/' + dummyProject._id + '/sprints/' + dummySprint._id + '/?forceDestroy=true')
		.loginVia(authUser, 'jwt')
		.end();
	
	response.assertStatus(200);
	
	response.assertJSONSubset({
		status: "OK"
	});
	
	const responseProject = await client.delete('/api/v1/projects/' + dummyProject._id + '/?forceDestroy=true')
		.loginVia(authUser, 'jwt')
		.end();
	
	responseProject.assertStatus(200);
	
	responseProject.assertJSONSubset({
		status: "OK"
	});
	
});
