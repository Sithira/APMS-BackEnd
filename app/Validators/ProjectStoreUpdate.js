'use strict';

class ProjectStoreUpdate
{

  get rules ()
  {
    return {
        name: "required|min:3",
        description: "required|min:10",
        _client_id: "required",
        _team_id: "required",
    }
  }

  async fails(errorMessages)
  {
      return this.ctx.response.send(errorMessages);
  }
}

module.exports = ProjectStoreUpdate;
