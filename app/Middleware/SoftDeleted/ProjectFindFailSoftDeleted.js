'use strict';

const Project = use('App/Models/Project');

class ProjectFindFailSoftDeleted
{

  async handle ({ request, response, params }, next) {

      let projects = null;

      let {
          pluck = "false",
          showAll = "false",
          plucks
      } = request.all();

      if (pluck === "true")
      {

          if (plucks === undefined || plucks == null)
          {

              projects = await Project.query().setVisible(['_id', 'name']).fetch();

          }
          else
          {

              plucks = JSON.parse(plucks);

              if (plucks.length >= 1)
              {
                  projects = await Project.query().setVisible(plucks).fetch();
              }
              else
              {
                  projects = await Project.query().setVisible(['_id', 'name']).fetch();
              }

          }

      }
      else
      {
          projects = await Project.all();
      }

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
