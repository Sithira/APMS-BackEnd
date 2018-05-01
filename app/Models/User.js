'use strict'

const Hash = use('Hash')
const Model = use('Model')

class User extends Model {
    static boot() {
        super.boot()

        /**
         * A hook to hash the user password before saving
         * it to the database.
         */
        this.addHook('beforeCreate', async (userInstance) => {
            if (userInstance.password) {
                userInstance.password = await Hash.make(userInstance.password)
            }
        })
    }

    static get primaryKey() {
        return "_id";
    }


    /**
     * A relationship on tokens is required for auth to
     * work. Since features like `refreshTokens` or
     * `rememberToken` will be saved inside the
     * tokens table.
     *
     * @method tokens
     *
     * @return {Object}
     */
    tokens() {
        return this.hasMany('App/Models/Token')
    }

    /**
     * Get the team of the user (employee only)
     *
     * @return {BelongsTo}
     */
    team()
    {
        return this.belongsTo('App/Models/Team', '_team_id', '_id');
    }

    /**
     * Get the skills of a user (employee only)
     *
     * @return {HasMany}
     */
    skills()
    {
        return this.hasMany('App/Models/Skill', '_id', '_user_id');
    }

}

module.exports = User;
