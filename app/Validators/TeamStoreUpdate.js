'use strict';

class TeamStoreUpdate
{
    get rules()
    {
        return {
            name: 'required|min:3'
        }
    }
}

module.exports = TeamStoreUpdate;
