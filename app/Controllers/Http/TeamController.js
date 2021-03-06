'use strict';

const Team = use("App/Models/Team");

const User = use("App/Models/User");

class TeamController
{
	
	// Todo: Only Admins can access this
	
	/**
	 * Get all the teams that are in the system.
	 *
	 * @param response
	 * @returns {Promise<*|{limit, strict, types}|Promise<any>>}
	 */
	async index({request, response})
	{
		
		// get the team from the body
		let teams = request.post().teams;
		
		// return th response
		return response.status(200).json({
			status: "OK",
			data: teams
		});
	}
	
	/**
	 * Create a new team in the system.
	 *
	 * @param request
	 * @param response
	 * @returns {Promise<*|{limit, strict, types}|Promise<any>>}
	 */
	async store({request, response})
	{
		// create the new team
		let team = await Team.create(request.all());
		
		// send the response to client.
		return response.status(201).json({
			status: "OK",
			data: team
		});
	}
	
	/**
	 * Get a specific team object.
	 *
	 * @param response
	 * @param request
	 * @returns {Promise<*|{limit, strict, types}|Promise<any>>}
	 */
	async show({request, response})
	{
		
		// get the team from the request body.
		const team = request.post().team;
		
		// return the team object
		return response.status(200).json({
			status: "OK",
			data: team
		});
		
	}
	
	/**
	 * Update a team
	 *
	 * @param request
	 * @param response
	 * @return {Promise<*|{limit, strict, types}|Promise<any>>}
	 */
	async update({request, response})
	{
		
		const team = request.post().team;
		
		team.merge(request.except(['team', 'relations']));
		
		await team.save();
		
		return response.status(200).json({
			status: "OK",
			data: team
		});
		
	}
	
	/**
	 * soft delete or force delete a team.
	 *
	 * @param request
	 * @param response
	 * @return {Promise<*|{limit, strict, types}|Promise<any>>}
	 */
	async destroy({request, response})
	{
		
		const team = request.post().team;
		
		const teamId = team._id;
		
		const {forceDestroy = "false"} = request.all();
		
		if (forceDestroy === "true")
		{
			
			// delete the object from the database.
			await team.delete();
			
			// return the response.
			return response.status(200).json({
				status: "OK",
				messages: `The team with the id: ${teamId} has been force deleted.`
			})
			
		}
		else
		{
			// set the deleted_at field
			const softDelete = {
				deleted_at: new Date().toISOString()
			};
			
			team.merge(softDelete);
			
			await team.save();
			
			return response.status(200).json({
				status: "OK",
				message: `The team with the id: ${teamId} has been successfully soft deleted`
			})
		}
		
	}
	
	/**
	 * Add a user to an existing team
	 *
	 * @param request
	 * @param params
	 * @return {Promise<*>}
	 */
	async addMember({request, response})
	{
		
		// get the teamId from the request body
		let team = request.post().team;
		
		await team.load('users');
		
		// count the number of team members
		let teamUserCount = team.$relations.users.rows.length;
		
		// limit the number of heads per team
		if (teamUserCount <= 5)
		{
			
			// get the user the request body
			let user = request.post().user;
			
			if (!user.hasOwnProperty("type") && !(user.type === "admin" || user.type === "manager"))
			{
				// add the user to the team instance (many-to-many)
				user.merge({_team_id: team._id, type: "user"});
				
				// save the user
				await user.save();
			}
			
			// return the response
			return response.status(200).json({
				status: "OK",
				data: {
					team: team,
					user: user
				}
			});
			
		}
		
		// return the error message
		return response.status(400).json({
			status: "ERROR",
			message: `Maximum user count for team ${team.name} of ${teamUserCount} / 05 has reached`
		});
		
	}
	
	/**
	 * Remove a user from the team.
	 *
	 * @param request
	 * @param response
	 * @return {Promise<*>}
	 */
	async removeMember({request, response})
	{
		
		// find the team with users
		let team = await Team.with(['users']).find(request.post().team._id);
		
		let user = request.post().user;
		
		if (!user.hasOwnProperty("type") && !(user.type === "admin" || user.type === "manager"))
		{
			// add the user to the team instance (many-to-many)
			user.merge({type: "client"});
		}
		
		// detach the user from the team
		user._team_id = null;
		
		// save the user.
		await user.save();
		
		// return the response
		return response.status(200).json({
			status: "OK",
			data: {
				team: team
			}
		})
		
	}
}

module.exports = TeamController;
