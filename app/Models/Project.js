'use strict'

const Model = use('Model');

class Project extends Model
{

    static get primaryKey()
    {
        return "_id";
    }

    /**
     * Return the manager that belong to the project
     *
     * @returns {HasOne}
     */
    manager()
    {
        return this.hasOne("App/Models/User", "_manager_id", "_id");
    }

    /**
     * Get the client for the project
     *
     * @return {BelongsTo}
     */
    client()
    {
        return this.belongsTo("App/Models/User", "_client_id", "_id");
    }

    /**
     * Get the Phases of a project
     *
     * @return {HasMany}
     */
    phases()
    {
        return this.hasMany('App/Models/Phase', '_id', '_project_id')
    }

    /**
     * Get the project version
     *
     * @return {HasMany}
     */
    versions()
    {
        return this.hasMany('App/Models/Version', '_id', '_project_id');
    }

    /**
     * Get the requirements of the project
     *
     * @return {HasMany}
     */
    requirements()
    {
        return this.hasMany('App/Models/Requirement', '_id', '_project_id');
    }

}

module.exports = Project;
