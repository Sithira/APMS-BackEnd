'use strict';

const Version = use('App/Models/Version');

class VersionFindFail
{

  async handle ({ request, response, params }, next) {

        // try to find the user from the database
        let version = await Version.find(params.versionId);

        // check for the users
        if (version === null)
        {

            // return 400 response with the message, if the user does not exists.
            return response.status(400).json({
                status: "ERROR",
                message: `Version with the id of ${params.versionId} could not be found.`
            });
        }

        // add the user object to the request body.
        request.body.version = version;

        // carry on with the request.
        await next()

    }
}

module.exports = VersionFindFail;
