'use strict';

const Sprint = use('App/Models/Sprint');

class SprintController {

    /**
     * Get all the sprints for a specific project
     *
     * @param params
     * @param response
     * @return {Promise<{limit, strict, types}|any>}
     */
    async index({request, response}) {

        // get the sprint from the request body.
        const sprint = request.post().sprint;

        // return the response.
        return await response.status(200).json({
            status: "OK",
            data: sprint
        });

    }

    /**
     * Get a sprint that belongs to a project
     *
     * @param request
     * @param response
     * @return {Promise<{limit, strict, types}|any>}
     */
    async show({request, response})
    {
        const sprint = request.post().sprint;

        return await response.status(200).json({
            status: "OK",
            data: sprint
        })
    }

    async store({request, response})
    {

        let project = request.post().project;

        let sprint = await Sprint.create(request.except(['project']));

        await project.sprint().save(sprint);

        return await response.status(200).json({
            status: "OK",
            data: sprint
        })

    }

}

module.exports = SprintController;
