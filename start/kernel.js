'use strict'

const Server = use('Server')

/*
|--------------------------------------------------------------------------
| Global Middleware
|--------------------------------------------------------------------------
|
| Global middleware are executed on each http request only when the routes
| match.
|
*/
const globalMiddleware = [
	'Adonis/Middleware/BodyParser',
	'Adonis/Middleware/Session',
	'Adonis/Middleware/Shield',
	'Adonis/Middleware/AuthInit'
]

/*
|--------------------------------------------------------------------------
| Named Middleware
|--------------------------------------------------------------------------
|
| Named middleware is key/value object to conditionally add middleware on
| specific routes or group of routes.
|
| // define
| {
|   auth: 'Adonis/Middleware/Auth'
| }
|
| // use
| Route.get().middleware('auth')
|
*/
const namedMiddleware = {
	
	// authenticate middleware
	auth: 'App/Middleware/Auth/VerifyAuthentication',
	
	// ownership and role based middleware
	auth_project: 'App/Middleware/Auth/VerifyProjectOwnership',
	auth_sprint: 'App/Middleware/Auth/VerifyProjectSprint',
	auth_ticket: 'App/Middleware/Auth/VerifyTicket',
	
	// Selecting
	userFindFail: 'App/Middleware/UserFindFail',
	projectFindFail: 'App/Middleware/ProjectFindFail',
	sprintFindFail: 'App/Middleware/SprintFindFail',
	ticketFindFail: 'App/Middleware/TicketFindFail',
	releaseFindFail: 'App/Middleware/ReleaseFindFail',
	teamFindFail: 'App/Middleware/TeamFindFail',
	
	//
	teamFromBody: 'App/Middleware/TeamFindFromBody',
	
	// check before deletion
	projectDeleteFail: 'App/Middleware/Deletions/ProjectDeleteFail',
	sprintDeleteFail: 'App/Middleware/Deletions/SprintDeleteFail',
	
	// check for soft deletions
	userFindFailSoftDeleted: 'App/Middleware/SoftDeleted/UserFindFailSoftDeleted',
	projectFindFailSoftDeleted: 'App/Middleware/SoftDeleted/ProjectFindFailSoftDeleted',
	sprintFindFailSoftDeleted: 'App/Middleware/SoftDeleted/SprintFindFailSoftDeleted',
	teamFindFailSoftDeleted: 'App/Middleware/SoftDeleted/TeamFindFailSoftDeleted',
}

/*
|--------------------------------------------------------------------------
| Server Middleware
|--------------------------------------------------------------------------
|
| Server level middleware are executed even when route for a given URL is
| not registered. Features like `static assets` and `cors` needs better
| control over request lifecycle.
|
*/
const serverMiddleware = [
	'Adonis/Middleware/Static',
	'Adonis/Middleware/Cors'
]

Server
	.registerGlobal(globalMiddleware)
	.registerNamed(namedMiddleware)
	.use(serverMiddleware)
