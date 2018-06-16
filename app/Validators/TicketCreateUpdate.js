'use strict';

class TicketCreateUpdate {

    get rules()
    {
        return {
            _sprint_id: 'required|exists:sprints,_id',
            _assignee_id: 'required|exists:users,_id',
            _release_id: 'required|exists:versions,_id',
            ticket_type: 'required',
            name: 'required|min:3',
            description: 'required|min:10',
            status: 'required|boolean',
            priority: 'required|integer',
            severity_level: 'required|integer',

            // validation for the ticket, if the ticket is a Epic ticket.
            epic_sub_type: 'requiredWhen:ticket_type,EPIC',

            // validation for the ticket, if the ticket is Bug ticket
            route_cause_analysis: 'requiredWhen:ticket_type,BUG',
            bug_sub_type: 'requiredWhen:ticket_type,BUG',
            description_of_fix: 'requiredWhen:ticket_type,BUG',

            // common for ticket types (EPIC and STORY ONLY)
            requirement_sign_off_date: 'requiredWhen:tick_type,EPIC|requiredWhen:ticket_type,STORY',
            design_review_date: 'requiredWhen:tick_type,EPIC|requiredWhen:ticket_type,STORY',
            common_test_plan: 'requiredWhen:tick_type,EPIC|requiredWhen:ticket_type,STORY',
            definition_of_done: 'requiredWhen:tick_type,EPIC|requiredWhen:ticket_type,STORY',
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

module.exports = TicketCreateUpdate;
