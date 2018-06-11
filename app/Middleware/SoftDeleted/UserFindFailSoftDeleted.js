'use strict';

const User = use('App/Models/User');

class UserFindFailSoftDeleted
{
  async handle ({ request }, next)
  {

      const users = await User.all();

      const {
          showAll = "false"
      } = request.all();

      if (showAll === "false")
      {
          for (let i = 0; i < users.rows.length; i++)
          {
              if (users.rows[i].$attributes.hasOwnProperty("deleted_at"))
              {

                  users.rows.splice(i, 1);

              }
          }
      }

      request.body.users = users;

    // call next to advance the request
    await next()
  }
}

module.exports = UserFindFailSoftDeleted
