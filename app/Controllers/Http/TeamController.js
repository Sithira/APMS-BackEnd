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
     * @param params
     * @returns {Promise<*|{limit, strict, types}|Promise<any>>}
     */
    async show({response, params})
    {

        // get a team
        const team = await Team.find(params.id);

        // check for the object nullability
        if (team === null)
        {
            return response.status(400).json({
                status: "ERROR",
                message: `Team with an id of: ${params.id} is not found.`
            });
        }

        // return the team object
        return response.status(200).json({
            status: "OK",
            data: team
        });

    }

    async update({request, }) {
    }

    async destroy() {
    }
}

module.exports = TeamController
