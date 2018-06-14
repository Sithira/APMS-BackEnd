'use strict';

const User = use('App/Models/User');

class UserFindFailSoftDeleted
{
  async handle ({ request }, next)
  {

      let users = null;

      let {
          showAll = "false",
          pluck = "false",
          plucks
      } = request.all();

      // if we have request to pluck from the users
      if (pluck === "true")
      {
            // check if we have any defined plucks
            if (plucks === undefined || plucks === null)
            {

                // since we dont have plucks defined, but still pluck is true
                // show the ID and name
                users = await User.query().setVisible(['_id', 'name']).fetch();
            }
            else
            {

                // if we have plucks
                plucks = JSON.parse(plucks);

                // check for the length
                if (plucks.length >= 1)
                {

                    // pluck using plucks
                    users = await User.query().setVisible(plucks).fetch();
                }
                else
                {

                    // or else return the default pluck.
                    users = await User.query().setVisible(['_id', 'name']).fetch();
                }
            }
      }
      else
      {
          users = await User.all();
      }

      // if we need to see soft deleted users
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
