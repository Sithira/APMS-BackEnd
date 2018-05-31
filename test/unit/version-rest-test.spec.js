'use strict';

const { test, trait } = use('Test/Suite')('Version R.E.S.T Test');

const Factory = use('Factory');

trait('Test/ApiClient');

let dummyProject = null;

let dummyVersion = null;

test("Add a version to a existing project", async({ client }) => {

    // mock an object in the memory
    const project = await Factory.model('App/Models/Project')
        .make();

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

    const version = await Factory.model('App/Models/Version')
        .make();

    const responseVersion = await client.post('/api/v1/projects/' + dummyProject._id + '/versions')
        .send(version.$attributes)
        .end();

    dummyVersion = (JSON.parse(responseVersion.text)).data;

    responseVersion.assertStatus(201);

    responseVersion.assertJSONSubset({
        status: "OK",
        data: {
            name: dummyVersion.name
        }
    });

});

test("A Version exists on a project", async({ client }) => {

    const response = await client.get('/api/v1/projects/' + dummyProject._id + '/versions')
        .end();

    response.assertStatus(200);

    response.assertJSONSubset({
        status: "OK",
        data: [
            {
                name: dummyVersion.name
            }
        ]
    });

});

test("A version can be updated when a version and project is given", async({ client }) => {

    let name = "Updating name";

    dummyVersion.name = name;

    const response = await client.patch('/api/v1/projects/' + dummyProject._id + '/versions/' + dummyVersion._id)
        .send(dummyVersion)
        .end();

    response.assertStatus(200);

    response.assertJSONSubset({
        status: "OK",
        data: {
            name: name
        }
    });

});


test("A version can be soft deleted from a project", async({ client }) => {

    const response = await client.delete('/api/v1/projects/' + dummyProject._id + '/versions/' + dummyVersion._id)
        .end();

    response.assertStatus(200);

    response.assertJSONSubset({
        status: "OK"
    });

});

test("A version can be soft deleted from a project", async({ client }) => {

    const response = await client.delete('/api/v1/projects/' + dummyProject._id + '/versions/' + dummyVersion._id + "/?forceDestroy=true")
        .end();

    response.assertStatus(200);

    response.assertJSONSubset({
        status: "OK"
    });

});