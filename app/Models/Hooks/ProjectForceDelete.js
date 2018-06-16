'use strict';

const Project = use('App/Models/Project');

const ProjectForceDelete = exports = module.exports = {};

/**
 * Removes any sprints that are associated with a deleting project.
 *
 * @param project
 * @return {Promise<void>}
 */
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

/**
 * Removes any releases associated with a deleting project.
 *
 * @param project
 * @return {Promise<void>}
 */
ProjectForceDelete.removeReleases = async (project) =>
{
	
	// find the model
	let projectQueried = await Project.with(['releases']).find(project._id);
	
	// fetch the relationships
	let releases = await projectQueried.releases().fetch();
	
	// check for the array
	if (releases.rows.length > 0)
	{
		
		// loop the instances
		for (let i = 0; i < releases.rows.length; i++)
		{
			
			// delete the model
			await releases.rows[i].delete();
		}
		
	}
	
};
