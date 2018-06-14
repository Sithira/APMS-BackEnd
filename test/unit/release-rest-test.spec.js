'use strict';

const { test, trait } = use('Test/Suite')('Release R.E.S.T Test');

const Factory = use('Factory');

trait('Test/ApiClient');

let dummyUser = null;

let dummyProject = null;

let dummyRelease = null;

let dummyTeam = null;

test("Add a Release to a existing project", async({ client }) => {

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

    const Release = await Factory.model('App/Models/Release')
        .make();

    const responseRelease = await client.post('/api/v1/projects/' + dummyProject._id + '/releases')
        .send(Release.$attributes)
        .end();

    dummyRelease = (JSON.parse(responseRelease.text)).data;

    responseRelease.assertStatus(201);

    responseRelease.assertJSONSubset({
        status: "OK",
        data: {
            name: dummyRelease.name
        }
    });

});

test("A Release exists on a project", async({ client }) => {

    const response = await client.get('/api/v1/projects/' + dummyProject._id + '/releases')
        .end();

    response.assertStatus(200);

    response.assertJSONSubset({
        status: "OK",
        data: [
            {
                name: dummyRelease.name
            }
        ]
    });

});

test("A Release can be updated when a Release and project is given", async({ client }) => {

    let name = "Updating name";

    dummyRelease.name = name;

    const response = await client.patch('/api/v1/projects/' + dummyProject._id + '/releases/' + dummyRelease._id)
        .send(dummyRelease)
        .end();

    response.assertStatus(200);

    response.assertJSONSubset({
        status: "OK",
        data: {
            name: name
        }
    });

});


test("A Release can be soft deleted from a project", async({ client }) => {

    const response = await client.delete('/api/v1/projects/' + dummyProject._id + '/releases/' + dummyRelease._id)
        .end();

    response.assertStatus(200);

    response.assertJSONSubset({
        status: "OK"
    });

});

test("A Release can be soft deleted from a project", async({ client }) => {

    const response = await client.delete('/api/v1/projects/' + dummyProject._id + '/releases/' + dummyRelease._id + "/?forceDestroy=true")
        .end();

    response.assertStatus(200);

    response.assertJSONSubset({
        status: "OK"
    });

    const responseDelete = await client.delete('/api/v1/projects/' + dummyProject._id + "/?forceDestroy=true")
        .end();

    responseDelete.assertStatus(200);

});