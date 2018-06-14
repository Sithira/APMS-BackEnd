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

Route.get('/test', async ({request, response}) => {

    let TeamUser = use('App/Models/TeamUser');

    return await TeamUser.with(['user', 'team', 'projects']).find("5b20afd100854933b9414bcb")

});

// todo: implement admin features.

/**
 * User Routes.
 */
Route.group(() => {

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


}).prefix(BaseUrl + '/users');

/**
 * Project Routes.
 */
Route.group(() => {

    // get all the projects
    Route.get('/', 'ProjectController.index')
        .middleware(['projectFindFailSoftDeleted']);

    // get a single project
    Route.get('/:projectId', 'ProjectController.show')
        .middleware(['projectFindFail']);

    // create new project in the database
    Route.post('/', 'ProjectController.store')
        .middleware(['teamFromBody'])
        .validator('ProjectStoreUpdate');

    // update a single project detail
    Route.patch('/:projectId', 'ProjectController.update')
        .middleware(['projectFindFail', 'teamFromBody'])
        .validator('ProjectStoreUpdate');

    // delete a given project ( soft or force )
    Route.delete('/:projectId', 'ProjectController.destroy')
        .middleware(['projectFindFail', 'projectDeleteFail']);

}).prefix(BaseUrl + '/projects');

/**
 * Team Routes
 */
Route.group(() => {

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
        .middleware(['teamFindFail']);


}).prefix(BaseUrl + '/teams');

/**
 * Project Sprint Routes.
 */
Route.group(() => {

    Route.get('/', 'SprintController.index');
        //.middleware(['sprintFindFailSoftDeleted']);

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
Route.group(() => {

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
    .middleware(['projectFindFail']);

/**
 * Ticket C.R.U.D Routes
 */
Route.group(() => {

    Route.get('/', 'TicketController.index');

    Route.get('/:ticketId', 'TicketController.show')
        .middleware(['ticketFindFail']);

    Route.post('/', 'TicketController.store')
        .validator('TicketCreateUpdate');

    Route.patch('/:ticketId', 'TicketController.update')
        .middleware(['ticketFindFail']);

    Route.delete('/:ticketId', 'TicketController.destroy')
        .middleware(['ticketFindFail']);

}).prefix(BaseUrl + '/projects/:projectId/sprints/:sprintId/tickets')
    .middleware(['projectFindFail', 'sprintFindFail']);

