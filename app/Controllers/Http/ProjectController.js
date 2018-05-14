'use strict'

const Project = use("App/Models/Project");

class ProjectController
{

    /**
     * Get all the projects
     *
     * @param response
     * @returns {Promise<*|{limit, strict, types}|Promise<any>>}
     */
    async index({response})
    {

        const projects = await Project.all();

        return response.status(200).json({
            status: "OK",
            data: projects
        });

    }

    /**
     * Get the specified user from the database.
     *
     * @param request
     * @param response
     * @return {Promise<*|{limit, strict, types}|Promise<any>>}
     */
    async show({request, response})
    {

        return response.status(200).json({
            status: "OK",
            data: request.post().project
        });

    }

    /**
     * Store new project in the database.
     *
     * @param request
     * @param response
     * @return {Promise<*|{limit, strict, types}|Promise<any>>}
     */
    async store({request, response})
    {

        // create the new project in the database.
        const project = await Project.create(request.all());

        // return the response with the newly created data
        return response.status(201).json({
            status: "OK",
            data: project
        });

    }

    /**
     * Update the details of a given resource when a id is provided.
     *
     * @param request
     * @param response
     * @return {Promise<*|{limit, strict, types}|Promise<any>>}
     */
    async update({request, response})
    {

        // get the project from the request body.
        const project = request.post().project;

        // update the project instance from the request body
        project.merge(request.except(['project']));

        // save the project
        await project.save();

        // return the response.
        return response.status(200).json({
            status: "OK",
            data: project
        });

    }

    /**
     * Soft delete or hard delete a resource with the given id.
     *
     * @param request
     * @param response
     * @return {Promise<*|{limit, strict, types}|Promise<any>>}
     */
    async destroy({request, response})
    {

        // get the project from the request body.
        const project = request.post().project;

        // check if the delete request was a force delete request
        let projectId = project._id;

        // get the force delete flags.
        const { forceDestroy = "false" } = request.all();

        if (forceDestroy === "true")
        {

            // delete the object form database
            await project.delete();

            // return the response
            return response.status(200).json({
                status: "OK",
                message: `The project with id: ${projectId} has been force deleted.`
            });
        }
        else
        {

            // set the deleted_at field
            const softDelete = {
                deleted_at: new Date().toISOString()
            };

            // merge the object
            project.merge(softDelete);

            // save the project
            await project.save();

            // return the response to the user.
            return response.status(200).json({
                status: "OK",
                message: `The project with id: ${projectId} has been deleted.`
            });
        }

    }

}

module.exports = ProjectController;
