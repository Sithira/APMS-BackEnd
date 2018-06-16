'use strict';

class ReleaseCreateUpdate
{
	
	get rules()
	{
		return {
			name: 'required|min:3',
			number: 'required',
			
			// relationship validators
			_project_id: 'required|exists:projects,_id'
		}
	}
	
	get validateAll()
	{
		return true
	}
	
	async fails(errorMessages)
	{
		return this.ctx.response.send(errorMessages)
	}
}

module.exports = ReleaseCreateUpdate;
