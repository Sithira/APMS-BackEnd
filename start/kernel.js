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
    auth: 'Adonis/Middleware/Auth',

    // Selecting
    userFindFail: 'App/Middleware/UserFindFail',
    projectFindFail: 'App/Middleware/ProjectFindFail',
    sprintFindFail: 'App/Middleware/SprintFindFail',
    ticketFindFail: 'App/Middleware/TicketFindFail',
    releaseFindFail: 'App/Middleware/ReleaseFindFail',

    // check before deletion
    projectDeleteFail: 'App/Middleware/Deletions/ProjectDeleteFail',
    sprintDeleteFail: 'App/Middleware/SprintDeleteFail',

    // check for soft deletions
    projectFindFailSoftDeleted: 'App/Middleware/SoftDeleted/ProjectFindFailSoftDeleted',
    sprintFindFailSoftDeleted: 'App/Middleware/SoftDeleted/SprintFindFailSoftDeleted',
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
