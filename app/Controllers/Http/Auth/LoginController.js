'use strict';

class LoginController
{

    /**
     * Login the user.
     *
     * @param request
     * @param response
     * @param auth
     * @return {Promise<*>}
     */
    async login({request, response, auth})
    {

        const {
            email,
            password
        } = request.all();

        let payLoad = await auth
            .withRefreshToken()
            .attempt(email, password);

        return response.status(200).json({
            status: "OK",
            data: payLoad
        });

    }

    async refreshToken({request, response, auth})
    {



    }

    /**
     * Logout the currently logged in user.
     *
     * @param request
     * @param response
     * @param auth
     * @return {Promise<*>}
     */
    async logout({request, response, auth})
    {

        try {

            await auth.logout();

            return response.status(200).json({
                status: "OK",
                message: "Successfully Logged out"
            });

        }
        catch (error)
        {
           throw new Error(error);
        }

    }

    async check({request, response, auth})
    {
        try {
            await auth.check();

            return response.status(403).json({
                status: "OK",
                message: "Authenticated"
            })
        } catch (error) {
            return response.status(403).json({
                status: "ERROR",
                message: error
            })
        }
    }

}

module.exports = LoginController;
