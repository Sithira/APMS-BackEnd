'use strict';

const Database = use("Database");

const User = use("App/Models/User");

class UserController {

    /**
     * Get all the users in the system
     *
     * @param request
     * @param response
     * @returns {Promise<void>}
     */
    async index({request, response})
    {

        let users = request.post().users;

        // return the response
        response.status(200).json({
            result: "OK",
            data: users
        })
    }

    /**
     * Get a single user object
     *
     * @param request
     * @param response
     * @return {Promise<*|{limit, strict, types}|Promise<any>>}
     */
    async show({request, response})
    {
        return response.json({
            status: "OK",
            data: request.post().user
        });
    }

    /**
     * Store a new user in the database.
     *
     * @param request
     * @param response
     * @returns {Promise<*|{limit, strict, types}|Promise<any>>}
     */
    async store({request, response})
    {

        // // define the validation rules for incoming request
        // const rules = {
        //     name: 'required|min:3',
        //     email: 'required|email',
        //     password: 'required|min:8'
        // };
        //
        // // validate the request
        // const validator = await validateAll(request.all(), rules);
        //
        // // check for validation errors
        // if (validator.fails())
        // {
        //     return response.status(400).json({
        //         result: "ERROR",
        //         data: validator.messages()
        //     })
        // }

        // create the new user
        const user = await User.create(request.all());

        // return the newly created user object
        return response.status(201).json({
            status: "OK",
            data: user
        });

    }

    /**
     * Update user details. Return the user object on success.
     *
     * @param request
     * @param response
     * @returns {Promise<*|{limit, strict, types}|Promise<any>>}
     */
    async update({request, response})
    {

        // get the user from the request body.
        let user = request.post().user;

        // merge everything togather
        user.merge(request.except(["user"]));

        // save the changes in the database.
        await user.save();

        // return the success response to the user.
        return response.json({
            status: "OK",
            data: user
        });

    }

    /**
     * Delete a specif row from the database
     *
     * @param request
     * @param response
     * @param params
     * @returns {Promise<*|{limit, strict, types}|Promise<any>>}
     */
    async destroy({request, response})
    {

        // get the force delete parameter.
        const { forceDestroy = "false" } = request.all();

        // get the user form the database
        let user = request.post().user;

        let userId = user._id;

        // check if the request is for a soft delete or hard delete
        if (forceDestroy === "false")
        {

            // define the deleted_at
            let deleteFields = {
                deleted_at: new Date().toISOString()
            };

            // add delete params
            user.merge(deleteFields);

            // save the obj3ct in database
            await user.save();

            // return the correct response.
            return response.status(200).json({
                status: "OK",
                data: `The user with the id: ${userId} has been successfully deleted`
            });

        }
        else
        {

            // delete forever
            await user.delete();

            // return the response
            return response.status(200).json({
                status: "OK",
                message: `User with the id: ${userId} has been successfully deleted.`
            });
        }


    }
}

module.exports = UserController;
