'use strict';

const {test, trait} = use('Test/Suite')('Tickets R.E.S.T Test');

const Factory = use('Factory');

let dummyProject = null;

let dummyRelease = null;

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

    //  create version for the release
    // dummyRelease = await Factory.model('App/Models/Release')
    //     .make();
    //
    // const response = await client.post('/api/v1/projects/' + dummyProject._id + '/releases')
    //     .send(dummyRelease.$attributes)
    //     .end();
    //
    // dummyRelease = (JSON.parse(response.text)).data;
    //
    // response.assertStatus(201);
    //
    // response.assertJSONSubset({
    //     status: "OK"
    // });

    // create the sprint

    dummySprint = await Factory.model('App/Models/Sprint')
        .make();

    const responseSprint = await client.post('/api/v1/projects/' + dummyProject._id + '/sprints')
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
    dummyTicket.$attributes.ticket_type = "BUG";
    dummyTicket.$attributes.route_cause_analysis = "Some Cause";
    dummyTicket.$attributes.bug_sub_type = "Some Type";
    dummyTicket.$attributes.description_of_fix = "Some fix description";

    const responseTicket = await client.post('/api/v1/projects/'
        + dummyProject._id + '/sprints/' + dummySprint._id + '/tickets')
        .send(dummyTicket.$attributes)
        .end();

    dummyTicket = (JSON.parse(responseTicket.text)).data;

    responseTicket.assertStatus(201);

    responseTicket.assertJSONSubset({
        status: "OK"
    });

});

test("A ticket exists on the given sprint", async({ client }) =>
{

    const response = await client.get('/api/v1/projects/' + dummyProject._id + '/sprints/' + dummySprint._id)
        .end();

    response.assertStatus(200);

    response.assertJSONSubset({
        status: "OK",
        data: {
            name: dummySprint.name
        }
    })

});

test("A Ticket can be updated when a sprint is given", async({ client }) => {


    dummyTicket.name = "Updating Sprint name";

    const response = await client.patch('/api/v1/projects/' + dummyProject._id + '/sprints/' + dummySprint._id + '/tickets/' + dummyTicket._id)
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


test("A ticket can be soft deleted when a sprint is given", async({ client }) => {

    // const response = await client.delete('/api/v1/projects/' + dummyProject._id + '/sprints/' + dummySprint._id + '/tickets/' + dummyTicket._id)
    //     .send(dummyTicket)
    //     .end();

    const response = await client.delete('/api/v1/projects/' + dummyProject._id + '/?forceDestroy=true')
        .send(dummyTicket)
        .end();

    response.assertStatus(200);

});

// test("A ticket can be soft deleted when a sprint is given", async({ client }) => {
//
//     const response = await client.delete('/api/v1/projects/' + dummyProject._id + '/sprints/' + dummySprint._id + '/tickets/' + dummyTicket._id + '/?forceDestroy=true')
//         .send(dummyTicket)
//         .end();
//
//     response.assertStatus(200);
//
// });