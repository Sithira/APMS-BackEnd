'use strict';

const { test, trait } = use('Test/Suite')('Tickets R.E.S.T Test');

const Factory = use('Factory');

let dummyProject = null;

let dummySprint = null;

let dummyTicket = null;

trait('Test/ApiClient');

test('Add ticket to existing sprint in a project', async ({ client }) => {


    dummyProject = Factory.model('App/Models/Version')
        .make();

    //const response = client.post('/api/v1/')


});

