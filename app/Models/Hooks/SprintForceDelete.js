'use strict';

const Sprint = use('App/Models/Sprint');

const SprintForceDelete = exports = module.exports = {};

/**
 * Remove associated tickets with a sprint.
 *
 * @param sprint
 * @return {Promise<void>}
 */
SprintForceDelete.removeTickets = async (sprint) =>
{

    // Get the model instance
    let sprintQueried = await Sprint.with(['tickets']).find(sprint._id);

    // get the model instance with with the related model instances
    let tickets = await sprintQueried.tickets().fetch();

    // get the rows count
    if (tickets.rows.length > 0)
    {

        // run the delete operation for every related instance
        for (let i = 0; i < tickets.rows.length; i++)
        {

            // delete the model.
            await tickets.rows[i].delete();

        }

    }

};
