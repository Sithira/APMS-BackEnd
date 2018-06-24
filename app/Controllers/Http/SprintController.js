'use strict';

const Sprint = use('App/Models/Sprint');
const Project = use('App/Models/Project');

class SprintController
{
	
	/**
	 * Get all the sprints for a specific project
	 *
	 * @param params
	 * @param response
	 * @return {Promise<{limit, strict, types}|any>}
	 */
	async index({request, response})
	{
		
		// get the sprint from the request body.
		const sprints = request.post().sprints;
		
		// return the response.
		return await response.status(200).json({
			status: "OK",
			data: sprints
		});
		
	}
	
	/**
	 * Get a sprint that belongs to a project
	 *
	 * @param request
	 * @param response
	 * @return {Promise<{limit, strict, types}|any>}
	 */
	async show({request, response})
	{
		const sprint = request.post().sprint;
		
		return await response.status(200).json({
			status: "OK",
			data: sprint
		})
	}
	
	/**
	 * Store a Sprint in a database.
	 *
	 * @param request
	 * @param response
	 * @return {Promise<{limit, strict, types}|any>}
	 */
	async store({request, response})
	{
		
		let project = request.post().project;
		
		let sprint = await Sprint.create(request.except(['project']));
		
		await project.sprints().save(sprint);
		
		return await response.status(201).json({
			status: "OK",
			data: sprint
		})
		
	}
	
	/**
	 * Update an given sprint.
	 *
	 * @param request
	 * @param response
	 * @return {Promise<{limit, strict, types}|any>}
	 */
	async update({request, response})
	{
		
		// get the sprint from the request body, added by the middleware.
		let sprint = request.post().sprint;
		
		// swap the current details with the updated details
		sprint.merge(request.except(['_project_id', 'tickets', 'project']));
		
		// wait for the sprint to save.
		await sprint.save();
		
		// send the response.
		return await response.status(200).json({
			status: "OK",
			data: sprint
		});
		
	}
	
	/**
	 * Soft delete or force delete the given sprint.
	 *
	 * @param request
	 * @param response
	 * @return {Promise<*|{limit, strict, types}|Promise<any>>}
	 */
	async destroy({request, response})
	{
		
		// get the sprint from the request body
		let sprint = request.post().sprint;
		
		// get the sprintId
		const sprintId = sprint._id;
		
		// get the forceDestroy params
		const {forceDestroy = "false"} = request.all();
		
		// check for the demanded deletion type.
		if (forceDestroy === "true")
		{
			await sprint.delete();
			
			return response.status(200).json({
				status: "OK",
				message: `The Sprint with id: ${sprintId} is force deleted.`
			});
		}
		else
		{
			// set the deleted_at field
			const softDelete = {
				deleted_at: new Date().toISOString()
			};
			
			// set the new attributes
			sprint.merge(softDelete);
			
			// save the updates in the database.
			await sprint.save();
			
			// return the response to the user.
			return response.status(200).json({
				status: "OK",
				message: `The Sprint with id: ${sprintId} has been deleted.`
			})
		}
		
	}
	
}

module.exports = SprintController;
