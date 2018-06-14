'use strict';

const User = use('App/Models/User');

const Team = use('App/Models/Team');

const UserForceDeleteHook = exports = module.exports = {};

/**
 * Remove the project if the current user is a client.
 *
 * @param user
 * @return {Promise<void>}
 */
UserForceDeleteHook.removeProjects = async (user) =>
{

    // get a new instance of the model with relations
    let userQueried = await User.with(['owned_projects']).find(user._id);

    // check for the count
    if (userQueried.$relations.owned_projects.rows.length >= 1)
    {

        // get the projects that a user is associated with
        let projects = userQueried.$relations.owned_projects.rows;

        // loop through every project
        for (let i = 0; i < userQueried.$relations.owned_projects.rows.length; i++)
        {

            // delete the project from existence.
            await projects[i].delete();

        }

    }

};
