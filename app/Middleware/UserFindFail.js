'use strict'

const User = use("App/Models/User");

class UserFindFail
{

  async handle ({ request, response, params }, next) {

      // try to find the user from the database
      let user = await User.find(params.id);

      // check for the users
      if (user === null)
      {

          // return 400 response with the message, if the user does not exists.
          return response.status(400).json({
              status: "ERROR",
              message: `User with the id of ${params.id} could not be found.`
          });
      }

      // add the user object to the request body.
      request.body.user = user;

      // carry on with the request.
      await next()

  }
}

module.exports = UserFindFail;
