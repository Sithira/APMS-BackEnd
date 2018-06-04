'use strict'

const Model = use('Model');

class Release extends Model
{

    static get primaryKey()
    {
        return "_id";
    }

    /**
     * Get the version that belongs to the project
     *
     * @return {HasOne}
     */
    project()
    {
        return this.hasOne('App/Models/Project', '_project_id', '_id');
    }


}

module.exports = Release;
