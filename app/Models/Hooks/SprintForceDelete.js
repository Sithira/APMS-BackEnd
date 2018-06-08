'use strict';

const Sprint = use('App/Models/Sprint');

const SprintForceDelete = exports = module.exports = {};

SprintForceDelete.removeTickets = async (sprint) => {


    let sprintQueried = await Sprint.with(['tickets']).find(sprint._id);

    let tickets = await sprintQueried.tickets().fetch();

    if (tickets.rows.length > 0)
    {

        for (let i = 0; i < tickets.rows.length; i++)
        {

            await tickets.rows[i].delete();

        }

    }


};
