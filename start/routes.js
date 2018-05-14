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

    const Project = use("App/Models/Project");

    // let p = await Project.find("5ae71cf47b960c21c37f4e14");
    //
    // return await p.client().fetch();

});

// todo: implement admin features.

/**
 * User Routes.
 */
Route.group(() => {

    // get all the users
    Route.get('/', 'UserController.index');

    // get a specified user from the database
    Route.get('/:id', 'UserController.show')
        .middleware(['userFindFail']);

    // add a new user to the database.
    Route.post('/', 'UserController.store')
        .validator('UserStoreUpdate');

    // update a specified user
    Route.patch('/:id', 'UserController.update')
        .middleware(['userFindFail'])
        .validator('UserStoreUpdate');

    // delete a specified user ( soft or hard )
    Route.delete('/:id', 'UserController.destroy')
        .middleware(['userFindFail']);


}).prefix(BaseUrl + '/users');

/**
 * Project Routes.
 */
Route.group(() => {

    // get all the projects
    Route.get('/', 'ProjectController.index');

    // get a single project
    Route.get('/:id', 'ProjectController.show')
        .middleware(['projectFindFail']);

    // create new project in the database
    Route.post('/', 'ProjectController.store')
        .validator('ProjectStoreUpdate');

    // update a single project detail
    Route.patch('/:id', 'ProjectController.update')
        .middleware(['projectFindFail'])
        .validator('ProjectStoreUpdate');

    // delete a given project ( soft or force )
    Route.delete('/:id', 'ProjectController.destroy')
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

}).prefix(BaseUrl + '/projects/:id/sprints')
    .middleware(['projectFindFail']);