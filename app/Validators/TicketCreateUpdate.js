'use strict';

class TicketCreateUpdate {

    get rules()
    {
        return {
            _project_id: 'required|exists:projects,id',
            _release_id: 'required',
            _assignee_id: 'required|exists:users,id',
            priority: 'required:number',
            serverity_level: 'required',
            description: 'required|min:6',
        }
    }
}

module.exports = TicketCreateUpdate;
