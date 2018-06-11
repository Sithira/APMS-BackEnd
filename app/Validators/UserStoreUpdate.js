'use strict'

class UserStoreUpdate {

    // async authorize ()
    // {
    //     if (!isAdmin)
    //     {
    //         this.ctx.response.unauthorized('Not authorized');
    //         return false
    //     }
    //
    //     return true
    // }

    get rules()
    {
        return {
            email: 'required|email',
            name: 'required|min:3',
            password: 'required|min:8',
            type: 'in:client,user,manager,admin'
        }
    }

    async fails (errorMessages)
    {
        return this.ctx.response.send(errorMessages)
    }
}

module.exports = UserStoreUpdate;
