'use strict';

const Version = use('App/Models/Version');

class VersionController
{

    async index({ request, response })
    {

        const project = request.post().project;

        const versions = await Version.query()
            .where({"_project_id": project._id})
            .fetch();

        return await response.json({
            status: "OK",
            data: versions
        })

    }

    async show({ request, response })
    {
        const version = request.post().version;

        return await response.status(200).json({
            status: "OK",
            data: version
        });
    }

    async store({ request, response })
    {

        let project = request.post().project;

        const version = await Version.create(request.except(['project']));

        await project.versions().save(version);

        response.status(201).json({
            status: "OK",
            data: version
        });

    }

    async update({ request, response })
    {

        const version = request.post().version;

        version.merge(request.except(['project', '_project_id']));

        await version.save();

        return await response.json({
            status: "OK",
            data: version
        })

    }

    async destory({ request, response })
    {

        const { forceDestroy = "false" } = request.all();

        const version = request.post().version;

        if (forceDestroy === "true")
        {

            await version.delete();

            return response.json({
                status: "OK",
                message: `Version with the version ID: ${versionId} has been soft deleted.`
            });

        }
        else
        {
            // set the deleted_at field
            const softDelete = {
                deleted_at: new Date().toISOString()
            };

            version.merge(softDelete);

            await version.save();

            return response.json({
                status: "OK",
                message: `Version with the version ID: ${versionId} has been soft deleted.`
            });

        }

    }

}

module.exports = VersionController;
