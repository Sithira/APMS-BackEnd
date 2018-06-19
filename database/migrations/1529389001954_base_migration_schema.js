'use strict'

const Schema = use('Schema')

class BaseMigrationSchema extends Schema
{
	up()
	{
		this.collection('users', (collection) => {
			collection.index('email_index', {email: 1}, {unique: true});
		});
	}
	
	down()
	{
		this.drop('users', 'projects', 'sprints', 'tickets', 'teams', 'tokens', 'releases');
	}
}

module.exports = BaseMigrationSchema;
