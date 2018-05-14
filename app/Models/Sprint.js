'use strict'

const Model = use('Model');

class Sprint extends Model
{

    /**
     * Get the project that the phase is belongs to.
     *
     * @return {BelongsTo}
     */
    project()
    {
        return this.belongsTo('App/Models/Project', '_project_id', '_id');
    }

}

module.exports = Sprint;
