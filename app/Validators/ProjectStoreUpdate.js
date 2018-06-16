'use strict';

class ProjectStoreUpdate
{
	
	get rules()
	{
		return {
			name: "required|min:3",
			description: "required|min:10",
			start_date: "required|date",
			end_date: "required|date",
			
			// relationships validators
			_client_id: "required|exists:users,_id",
			_manager_id: "required|exists:users,_id",
			_team_id: "required|exists:teams,_id"
		}
	}
	
	get validateAll()
	{
		return true
	}
	
	async fails(errorMessages)
	{
		return this.ctx.response.send(errorMessages);
	}
}

module.exports = ProjectStoreUpdate;
