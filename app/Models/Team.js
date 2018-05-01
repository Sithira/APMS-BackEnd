'use strict'

const Model = use('Model')

class Team extends Model
{

    /**
     * Get all the users in a team
     *
     * @returns {HasMany}
     */
    users()
    {
        return this.hasMany("App/Models/User", "_user_id", "_team_id");
    }

    /**
     * Get all the phases that belongs to the phase of a project.
     *
     * @returns {HasMany}
     */
    phases()
    {
        return this.hasMany("App/Models/Phases", "_phase_id", "_team_id");
    }



}

module.exports = Team;
