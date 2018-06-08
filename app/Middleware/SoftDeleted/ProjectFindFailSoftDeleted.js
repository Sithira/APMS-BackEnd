'use strict';

const Project = use('App/Models/Project');

class ProjectFindFailSoftDeleted
{

  async handle ({ request, response, params }, next) {

      const projects = await Project.all();

      const {
          forceDestroy="false",
          showAll = "false"
      } = request.all();

      if (showAll === "false")
      {
          for (let i = 0; i < projects.rows.length; i++)
          {
              if (projects.rows[i].$attributes.hasOwnProperty("deleted_at"))
              {

                  projects.rows.splice(i, 1);

              }
          }
      }

      request.body.projects = projects;

      await next()
  }
}

module.exports = ProjectFindFailSoftDeleted;
