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

Route.on('/').render('welcome');

const BaseUrl = '/api/v1';

Route.post('/test', async ({request, response}) => {

    return await {state: "OK"};

}).validator('TicketCreateUpdate');

// todo: implement admin features.

/**
 * User Routes.
 */
Route.group(() => {

    // get all the users
    Route.get('/', 'UserController.index');

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


}).prefix(BaseUrl + '/users');

/**
 * Project Routes.
 */
Route.group(() => {

    // get all the projects
    Route.get('/', 'ProjectController.index');

    // get a single project
    Route.get('/:projectId', 'ProjectController.show')
        .middleware(['projectFindFail']);

    // create new project in the database
    Route.post('/', 'ProjectController.store')
        .validator('ProjectStoreUpdate');

    // update a single project detail
    Route.patch('/:projectId', 'ProjectController.update')
        .middleware(['projectFindFail'])
        .validator('ProjectStoreUpdate');

    // delete a given project ( soft or force )
    Route.delete('/:projectId', 'ProjectController.destroy')
        .middleware(['projectFindFail']);

}).prefix(BaseUrl + '/projects');

/**
 * Project Sprint Routes.
 */
Route.group(() => {

    Route.get('/', 'SprintController.index');

    Route.get('/:sprintId', 'SprintController.show')
        .middleware(['sprintFindFail']);

    Route.post('/', 'SprintController.store')
        .validator('SprintCreateUpdate');

    Route.patch('/:sprintId', 'SprintController.update')
        .middleware(['sprintFindFail']);

    Route.delete('/:sprintId', 'SprintController.destroy')
        .middleware(['sprintFindFail']);

}).prefix(BaseUrl + '/projects/:projectId/sprints')
    .middleware(['projectFindFail']);

/**
 * Ticket C.R.U.D Routes
 */
Route.group(() => {

    Route.get('/', 'TicketController.index');

    Route.get('/:ticketId', 'TicketController.show')
        .middleware(['ticketFindFail']);

    Route.post('/', 'TicketController.store').validator('TicketCreateUpdate');

    Route.patch('/:ticketId', 'TicketController.update')
        .middleware(['ticketFindFail']);

    Route.delete('/:ticketId', 'TicketController.destroy')
        .middleware(['ticketFindFail']);

}).prefix(BaseUrl + '/project/:projectId/sprints/:sprintId/tickets')
    .middleware(['projectFindFail', 'sprintFindFail']);