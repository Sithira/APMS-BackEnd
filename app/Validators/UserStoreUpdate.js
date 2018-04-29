'use strict'

class UserStoreUpdate {

    get rules()
    {
        return {
            email: 'required|email',
            name: 'required|min:3',
            password: 'required|min:8'
        }
    }

    async fails (errorMessages)
    {
        return this.ctx.response.send(errorMessages)
    }
}

module.exports = UserStoreUpdate;
