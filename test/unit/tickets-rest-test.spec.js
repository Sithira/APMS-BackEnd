'use strict';

const Suite = use('Test/Suite')('Tickets R.E.S.T Test');

const {before, test, trait} = Suite;

trait('Test/ApiClient');

trait('Auth/Client');

const Factory = use('Factory');

let project = null;

let dummySprint = null;

let authUser = null;

let dummyTicket = null;

let dummyRelease = null;

let dummyTeam = null;

before(async () =>
{
	// get an authenticated user.
	authUser = await Factory.model('App/Models/User')
		.create({type: "admin"});
});


test('A ticket can be created for a project', async ({client}) =>
{
	
	// create the project
	project = await Factory.model('App/Models/Project')
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
	
	const projectResponse = await client.post('/api/v1/projects')
		.loginVia(authUser, 'jwt')
		.send(project.$attributes)
		.end();
	
	project = (JSON.parse(projectResponse.text)).data;
	
	projectResponse.assertStatus(201);
	
	projectResponse.assertJSONSubset({
		status: "OK",
		data: {
			name: project.name
		}
	});
	
	//  create version for the release
	dummyRelease = await Factory.model('App/Models/Release')
		.make();
	
	dummyRelease.$attributes._project_id = project._id;
	
	const response = await client.post('/api/v1/projects/' + project._id + '/releases')
		.loginVia(authUser, 'jwt')
		.send(dummyRelease.$attributes)
		.end();
	
	dummyRelease = (JSON.parse(response.text)).data;
	
	response.assertStatus(201);
	
	response.assertJSONSubset({
		status: "OK"
	});
	
	// create the sprint
	dummySprint = await Factory.model('App/Models/Sprint')
		.make();
	
	dummySprint.$attributes._project_id = project._id;
	
	const responseSprint = await client.post('/api/v1/projects/' + project._id + '/sprints')
		.loginVia(authUser, 'jwt')
		.send(dummySprint.$attributes)
		.end();
	
	dummySprint = (JSON.parse(responseSprint.text)).data;
	
	responseSprint.assertStatus(201);
	
	responseSprint.assertJSONSubset({
		status: "OK"
	});
	
	dummyTicket = await Factory.model('App/Models/Ticket')
		.make();
	
	dummyTicket.$attributes._sprint_id = dummySprint._id;
	dummyTicket.$attributes._assignee_id = authUser._id;
	dummyTicket.$attributes._release_id = dummyRelease._id;
	dummyTicket.$attributes.ticket_type = "BUG";
	dummyTicket.$attributes.route_cause_analysis = "Some Cause";
	dummyTicket.$attributes.bug_sub_type = "Some Type";
	dummyTicket.$attributes.description_of_fix = "Some fix description";
	
	const responseTicket = await client.post('/api/v1/projects/'
		+ project._id + '/sprints/' + dummySprint._id + '/tickets')
		.loginVia(authUser, 'jwt')
		.send(dummyTicket.$attributes)
		.end();
	
	dummyTicket = (JSON.parse(responseTicket.text)).data;
	
	responseTicket.assertStatus(201);
	
	responseTicket.assertJSONSubset({
		status: "OK"
	});
	
});

test("A ticket exists on the given sprint", async ({client}) =>
{
	
	const response = await client.get('/api/v1/projects/' + project._id + '/sprints/' + dummySprint._id)
		.loginVia(authUser, 'jwt')
		.end();
	
	response.assertStatus(200);
	
	response.assertJSONSubset({
		status: "OK",
		data: {
			name: dummySprint.name
		}
	})
	
});

test("A Ticket can be updated when a sprint is given", async ({client}) =>
{
	
	
	dummyTicket.name = "Updating Ticket name";
	
	const response = await client.patch('/api/v1/projects/' + project._id + '/sprints/' + dummySprint._id + '/tickets/' + dummyTicket._id)
		.loginVia(authUser, 'jwt')
		.send(dummyTicket)
		.end();
	
	dummyTicket = (JSON.parse(response.text)).data;
	
	response.assertStatus(200);
	
	response.assertJSONSubset({
		status: "OK",
		data: {
			name: dummyTicket.name
		}
	})
	
});


test("A ticket can be soft deleted when a sprint is given", async ({client}) =>
{
	
	const response = await client.delete('/api/v1/projects/' + project._id + '/sprints/' + dummySprint._id + '/tickets/' + dummyTicket._id)
		.loginVia(authUser, 'jwt')
		.send(dummyTicket)
		.end();
	
	response.assertStatus(200);
	
	response.assertJSONSubset({
		status: "OK"
	});
	
});

test("A ticket can be force deleted when a sprint is given", async ({client}) =>
{
	
	const response = await client.delete('/api/v1/projects/' + project._id + '/sprints/' + dummySprint._id + '/tickets/' + dummyTicket._id + '/?forceDestroy=true')
		.loginVia(authUser, 'jwt')
		.send(dummyTicket)
		.end();
	
	response.assertStatus(200);
	
	response.assertJSONSubset({
		status: "OK"
	});
	
	const responseProject = await client.delete('/api/v1/projects/' + project._id + '/?forceDestroy=true')
		.loginVia(authUser, 'jwt')
		.send(dummyTicket)
		.end();
	
	responseProject.assertStatus(200);
	
	responseProject.assertJSONSubset({
		status: "OK"
	});
	
});