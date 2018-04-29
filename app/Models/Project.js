'use strict'

const Model = use('Model')

class Project extends Model
{

    /**
     * Return the manager that belong to the project
     *
     * @returns {HasOne}
     */
    manager()
    {
        return this.hasOne("App/Models/User", "_manager_id", "_id");
    }



}

module.exports = Project
