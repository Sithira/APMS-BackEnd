'use strict';

const Release = use('App/Models/Release');

class ReleaseController
{

    async index({ request, response })
    {

        const project = request.post().project;

        const releases = await Release.query()
            .where({"_project_id": project._id})
            .fetch();

        return await response.json({
            status: "OK",
            data: releases
        })

    }

    async show({ request, response })
    {
        const release = request.post().release;

        return await response.status(200).json({
            status: "OK",
            data: release
        });
    }

    async store({ request, response })
    {

        let project = request.post().project;

        const release = await Release.create(request.except(['project']));

        await project.releases().save(release);

        response.status(201).json({
            status: "OK",
            data: release
        });

    }

    async update({ request, response })
    {

        const release = request.post().release;

        release.merge(request.except(['project', '_project_id']));

        await release.save();

        return await response.json({
            status: "OK",
            data: release
        })

    }

    async destory({ request, response })
    {

        const { forceDestroy = "false" } = request.all();

        const release = request.post().release;

        if (forceDestroy === "true")
        {

            await release.delete();

            return response.json({
                status: "OK",
                message: `Release with the release ID: ${releaseId} has been soft deleted.`
            });

        }
        else
        {
            // set the deleted_at field
            const softDelete = {
                deleted_at: new Date().toISOString()
            };

            release.merge(softDelete);

            await release.save();

            return response.json({
                status: "OK",
                message: `Release with the release ID: ${releaseId} has been soft deleted.`
            });

        }

    }

}

module.exports = ReleaseController;
