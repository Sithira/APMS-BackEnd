'use strict'

const Team = use("App/Models/Team");

const {validateAll} = use("Validation");

class TeamController {

    // Todo: Only Admins can access this

    /**
     * Get all the teams that are in the system.
     *
     * @param response
     * @returns {Promise<*|{limit, strict, types}|Promise<any>>}
     */
    static async index({response})
    {
        return response.status(200).json({
            status: "OK",
            data: await Team.all()
        });
    }

    /**
     * Create a new team in the system.
     *
     * @param request
     * @param response
     * @returns {Promise<*|{limit, strict, types}|Promise<any>>}
     */
    async store({request, response})
    {

        // define the rules to validated against the request.
        const rules = {
            name: "required|min:3",
            type: "required|min:3",
            description: "required|min:5"
        };

        // validate the request
        const validation = validateAll(request.all(), rules);

        // if we fail to validate the request
        if (validation.fails()) {

            // then we return all errors.
            return response.status(400).json({
                status: "ERROR",
                messages: validation.messages()
            });

        }

        // create the new team
        let team = await Team.create(request.all());

        // send the response to client.
        return response.status(201).json({
            status: "OK",
            data: team
        });
    }

    /**
     * Get a specific team object.
     *
     * @param response
     * @param request
     * @returns {Promise<*|{limit, strict, types}|Promise<any>>}
     */
    async show({request, response})
    {

        // get the team from the request body.
        const team = request.post().team;

        // return the team object
        return response.status(200).json({
            status: "OK",
            data: team
        });

    }

    /**
     * Update a team
     *
     * @param request
     * @param response
     * @return {Promise<*|{limit, strict, types}|Promise<any>>}
     */
    async update({request, response})
    {

        // todo: add / remove users as team members

        const team = request.post().team;

        team.merge(request.except(['team']));

        await team.save();

        return response.status(200).json({
            status: "OK",
            data: team
        });

    }

    /**
     * soft delete or force delete a team.
     *
     * @param request
     * @param response
     * @return {Promise<*|{limit, strict, types}|Promise<any>>}
     */
    async destroy({request, response})
    {

        const team = request.post().team;

        const teamId = team._id;

        const { forceDestroy = "false" } = request.all();

        if (forceDestroy === "true")
        {

            // delete the object from the database.
            await team.delete();

            // return the response.
            return response.status(200).json({
                status: "OK",
                messages: `The team with the id: ${teamId} has been force deleted.`
            })

        }
        else
        {
            // set the deleted_at field
            const softDelete = {
                deleted_at: new Date().toISOString()
            };

            team.merge(softDelete);

            await team.save();

            return response.status(200).json({
                status: "OK",
                message: `The ticket with the id: ${teamId} has been successfully soft deleted`
            })
        }

    }
}

module.exports = TeamController;
