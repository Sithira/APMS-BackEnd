'use strict';

const { test, trait } = use('Test/Suite')('Project R.E.S.T Test');

const Factory = use('Factory');

let dummyProject = null;

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