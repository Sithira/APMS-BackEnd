'use strict';

const { test, trait } = use('Test/Suite')('Project R.E.S.T Test');

const Factory = use('Factory');

let dummyProject = null;

let dummyUser  = null;

let dummyTeam = null;

trait('Test/ApiClient');

test("All projects can be fetched via the API", async ({ client }) => {

    // send the request to the API
    const response = await client.get('/api/v1/projects')
        .end();

    // check if we have a status of 200
    response.assertStatus(200);

    // check if the API return the status of "OK"
    response.assertJSONSubset({
        status: "OK"
    });

});


test('A new project can be created via the API', async ({client}) => {

    // mock an object in the memory
    const project = await Factory.model('App/Models/Project')
        .make();

    // create a dummy user
    const user = await Factory.model('App/Models/User')
        .make();

    // create an team
    const team = await Factory.model('App/Models/Team')
        .make();

    // response for the create user
    const responseUser = await client.post('/api/v1/users')
        .send(user.$attributes)
        .end();

    // parse the dummyUser
    dummyUser = (JSON.parse(responseUser.text)).data;

    // add the client_id to the attributes
    project.$attributes['_client_id'] = dummyUser._id;

    // hit the API tp save the team
    const responseTeam = await client.post('/api/v1/teams')
        .send(team.$attributes)
        .end();

    // parse to JSON
    dummyTeam = (JSON.parse(responseTeam.text)).data;

    // append to the project attributes
    project.$attributes['_team_id'] = dummyTeam._id;

    // using it's data, we send a request to the API server.
    const response = await client.post('/api/v1/projects')
        .send(project.$attributes)
        .end();

    // convert the project to JSON
    dummyProject = (JSON.parse(response.text)).data;

    // status of 201 will be return upon success
    response.assertStatus(201);

    // check if the returned data matches the prev mocked object
    response.assertJSONSubset({
        status: "OK", // check if we have a status of OK""
        data: {
            name: project.$attributes.name
        }
    });

});

test('A project can be updated via the API', async ({ client }) => {


    dummyProject.name = "Some updated project name";

    const response = await client.patch('/api/v1/projects/' + dummyProject._id)
        .send(dummyProject)
        .end();

    response.assertStatus(200);

    response.assertJSONSubset({
        data: {
            name: dummyProject.name
        }
    })

});


test('A project can be soft deleted vai the API', async ({ client }) => {

    const response = await client.delete('/api/v1/projects/' + dummyProject._id)
        .end();

    response.assertStatus(200);

    response.assertJSONSubset({
        status: "OK"
    });

});

test('A Project can be force deleted via the API', async ({ client }) => {

    const response = await client.delete('/api/v1/projects/' + dummyProject._id + "/?forceDestroy=true")
        .end();

    response.assertStatus(200);

    response.assertJSONSubset({
        status: "OK"
    })

});