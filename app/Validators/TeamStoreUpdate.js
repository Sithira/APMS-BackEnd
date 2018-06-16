'use strict';

class TeamStoreUpdate
{
	get rules()
	{
		return {
			name: 'required|min:3'
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

module.exports = TeamStoreUpdate;
