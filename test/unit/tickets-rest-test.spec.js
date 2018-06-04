'use strict';

const {test, trait} = use('Test/Suite')('Tickets R.E.S.T Test');

const Factory = use('Factory');

let dummyProject = null;

let dummyVersion = null;

let dummySprint = null;

let dummyTicket = null;

trait('Test/ApiClient');

test('A ticket can be created for a project', async ({client}) => {

    // create the project
    dummyProject = await Factory.model('App/Models/Project')
        .make();

    const projectResponse = await client.post('/api/v1/projects')
        .send(dummyProject.$attributes)
        .end();

    dummyProject = (JSON.parse(projectResponse.text)).data;

    projectResponse.assertStatus(201);

    projectResponse.assertJSONSubset({
        status: "OK",
        data: {
            name: dummyProject.name
        }
    });

    //  create version for the version
    dummyVersion = await Factory.model('App/Models/Release')
        .make();

    const response = await client.post('/api/v1/projects/' + dummyProject._id + '/releases')
        .send(dummyVersion.$attributes)
        .end();

    dummyVersion = (JSON.parse(response.text)).data;

    response.assertStatus(201);

    response.assertJSONSubset({
        status: "OK"
    });

    //

});

