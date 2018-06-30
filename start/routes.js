'use strict';

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

const Route = use('Route');

const BaseUrl = '/api/v1';

Route.get('/', async ({request, response}) =>
{
	return response.status(200).json({
		status: "OK",
		message: "Hi, Welcome to APMS-BackEnd. To use our services, please use /api/{current-version} end points.",
		help: `Please use /docs for API documentation`
	})
});

Route.get(BaseUrl, async ({request, response}) =>
{
	return response.status(302).json({
		status: "ERROR",
		message: 'Please refer /docs for API documentation'
	});
});

Route.get('/test', async ({request, response, auth}) =>
{
	//const TeamUser = use('App/Models/TeamUser');
	
	const User = use('App/Models/User');
	
	let user = await User.with(['team', 'team.projects', 'team.projects.manager']).find('5b25ebc92e7a6e0b64117256');
	
	//console.log(Object.getOwnPropertyNames(User.prototype));
	
	//let user = await TeamUser.with(['team', 'team.users', 'team.projects']).find("5b25d033fba25708df52cd7c");
	
	return response.json(user);
	
});


Route.group(() =>
{
	Route.get('/', 'Auth/ProfileController.index');
	
	Route.post('/login', 'Auth/LoginController.login');
	
	Route.post('/logout', 'Auth/LoginController.logout');
	
}).prefix('/auth');


Route.get('check', 'Auth/LoginController.check');

/**
 * User Routes.
 */
Route.group(() =>
{
	
	Route.get('/get-type', 'UserController.getType');
	
	// get all the users
	Route.get('/', 'UserController.index')
		.middleware(['userFindFailSoftDeleted']);
	
	// get a specified user from the database
	Route.get('/:userId', 'UserController.show')
		.middleware(['userFindFail']);
	
	// add a new user to the database.
	Route.post('/', 'UserController.store')
		.validator('UserStoreUpdate');
	
	// update a specified user
	Route.patch('/:userId', 'UserController.update')
		.middleware(['userFindFail'])
		.validator('UserStoreUpdate');
	
	// delete a specified user ( soft or hard )
	Route.delete('/:userId', 'UserController.destroy')
		.middleware(['userFindFail']);
	
}).prefix(BaseUrl + '/users')
	.middleware(['auth:admin']);

/**
 * Project Routes.
 */
Route.group(() =>
{
	
	// get all the projects
	Route.get('/', 'ProjectController.index')
		.middleware(['projectFindFailSoftDeleted']);
	
	// get a single project
	Route.get('/:projectId', 'ProjectController.show')
		.middleware(['projectFindFail', 'auth_project:client,developer,manager']);
	
	// create new project in the database
	Route.post('/', 'ProjectController.store')
		.middleware(['teamFromBody', 'auth:admin,manager', 'auth_project:manager'])
		.validator('ProjectStoreUpdate');
	
	// update a single project detail
	Route.patch('/:projectId', 'ProjectController.update')
		.middleware(['projectFindFail', 'teamFromBody', 'auth_project:manager'])
		.validator('ProjectStoreUpdate');
	
	// delete a given project ( soft or force )
	Route.delete('/:projectId', 'ProjectController.destroy')
		.middleware(['projectFindFail', 'projectDeleteFail', 'auth_project:manager']);
	
}).prefix(BaseUrl + '/projects')
	.middleware(['auth']);

/**
 * Team Routes
 */
Route.group(() =>
{
	
	Route.get('/', 'TeamController.index')
		.middleware(['teamFindFailSoftDeleted']);
	
	Route.get('/:teamId', 'TeamController.show')
		.middleware(['teamFindFail']);
	
	Route.post('/', 'TeamController.store')
		.validator(['TeamStoreUpdate']);
	
	Route.post('/:teamId/:userId/', 'TeamController.addMember')
		.middleware(['teamFindFail', 'userFindFail']);
	
	Route.delete('/:teamId/:userId/', 'TeamController.removeMember')
		.middleware(['teamFindFail', 'userFindFail']);
	
	Route.delete('/:teamId', 'TeamController.destroy')
		.middleware(['teamFindFail', 'auth:admin']);
	
	
}).prefix(BaseUrl + '/teams')
	.middleware(['auth:admin,manager']);

/**
 * Project Sprint Routes.
 */
Route.group(() =>
{
	
	Route.get('/', 'SprintController.index')
		.middleware(['sprintFindFailSoftDeleted']);
	
	Route.get('/:sprintId', 'SprintController.show')
		.middleware(['sprintFindFail']);
	
	Route.post('/', 'SprintController.store')
		.validator('SprintCreateUpdate');
	
	Route.patch('/:sprintId', 'SprintController.update')
		.middleware(['sprintFindFail'])
		.validator('SprintCreateUpdate');
	
	Route.delete('/:sprintId', 'SprintController.destroy')
		.middleware(['sprintFindFail', 'sprintDeleteFail']);
	
}).prefix(BaseUrl + '/projects/:projectId/sprints')
	.middleware(['projectFindFail']);

/**
 * Project Release Routes
 */
Route.group(() =>
{
	
	Route.get('/', 'ReleaseController.index');
	
	Route.post('/', 'ReleaseController.store')
		.validator(['releaseCreateUpdate']);
	
	Route.get('/:releaseId', 'ReleaseController.show')
		.middleware(['releaseFindFail']);
	
	Route.patch('/:releaseId', 'ReleaseController.update')
		.middleware(['releaseFindFail'])
		.validator('releaseCreateUpdate');
	
	Route.delete('/:releaseId', 'ReleaseController.update')
		.middleware(['releaseFindFail']);
	
}).prefix(BaseUrl + '/projects/:projectId/releases')
	.middleware(['projectFindFail', 'auth_project:admin,manager']);

/**
 * Ticket C.R.U.D Routes
 */
Route.group(() =>
{
	
	Route.get('/', 'TicketController.index')
		.middleware(['ticketFindFailSoftDeleted']);
	
	Route.get('/:ticketId', 'TicketController.show')
		.middleware(['ticketFindFail', 'auth_ticket']);
	
	Route.post('/', 'TicketController.store')
		.validator('TicketCreateUpdate', 'auth_project:manager,developer');
	
	Route.patch('/:ticketId', 'TicketController.update')
		.middleware(['ticketFindFail', 'auth_ticket']);
	
	Route.delete('/:ticketId', 'TicketController.destroy')
		.middleware(['ticketFindFail', 'auth_ticket', 'auth_project:manager']);
	
}).prefix(BaseUrl + '/projects/:projectId/sprints/:sprintId/tickets')
	.middleware(['projectFindFail', 'sprintFindFail']);

