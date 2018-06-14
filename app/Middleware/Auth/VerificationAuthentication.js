'use strict'

class VerificationAuthentication
{

  async handle ({ request, response, auth}, next, schemes)
  {

    let user;

    try
    {

      // get the user by authenticating the user with the JWT token
      user = await auth.getUser();

      // if we have a prop for admin
      if (schemes.indexOf("admin") !== -1)
      {
          if (user.type !== "admin")
          {
              return response.status(403).json({
                  status: "ERROR",
                  type: "admin",
                  message: "You don't have required permissions"
              });
          }
      }

      // if we have prop for a manager
      if (schemes.indexOf("manager") !== -1)
      {
          if (user.type !== "manager")
          {
              return response.status(403).json({
                  status: "ERROR",
                  type: "manager",
                  message: "You don't have required permissions"
              });
          }
      }

      // return for the next action.
      await next();
    }
    catch (error)
    {
        return response.status(403).json({
            status: "ERROR",
            message: "Missing, Invalid or expired token. Please Re-Login"
        })
    }

  }
}

module.exports = VerificationAuthentication;
