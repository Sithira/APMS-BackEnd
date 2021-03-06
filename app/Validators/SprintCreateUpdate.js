'use strict';

class SprintCreateUpdate
{
	
	get rules()
	{
		return {
			
			name: "required|min:3",
			description: "required|min:10",
			start_date: "required|date",
			end_date: "required|date",
			
			// relationship validators
			_project_id: "required|exists:projects,_id"
			
		};
	};
	
	get validateAll()
	{
		return true
	}
	
	async fails(errorMessages)
	{
		return this.ctx.response.send(errorMessages);
	}
	
}

module.exports = SprintCreateUpdate;
