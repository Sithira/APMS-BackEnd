'use strict';

const Project = use('App/Models/Project');

const ProjectForceDelete = exports = module.exports = {};

ProjectForceDelete.removeSprints = async (project) =>
{

    // query the object again, with sprints
    let projectQueried = await Project.with(['sprints']).find(project._id);

    // call the relationship
    let sprints = await projectQueried.sprints().fetch();

    // check for any matching sprints
    if (sprints.rows.length > 0)
    {

        // loop for the rows count.
        for (let i = 0; i < sprints.rows.length; i++)
        {

            // delete the sprint.
            await sprints.rows[i].delete();
        }

    }
};
