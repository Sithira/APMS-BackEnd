'use strict';

class ReleaseCreateUpdate {

    get rules()
    {
        return {
            name: 'required|min:3',
            number: 'required'
        }
    }

    async fails(errorMessages)
    {
        return this.ctx.response.send(errorMessages)
    }
}

module.exports = ReleaseCreateUpdate;
