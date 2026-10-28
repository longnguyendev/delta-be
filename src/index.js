'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    /*
     * The status enum is language-independent. Existing projects created before
     * the field existed start with `null`, which would break the required enum
     * in GraphQL. Give them the default value once; editors can then switch the
     * handed-over projects in the admin panel.
     */
    const missing = await strapi.db.query('api::project.project').findMany({
      where: { status: { $null: true } },
      select: ['id'],
    });

    for (const project of missing) {
      await strapi.db.query('api::project.project').update({
        where: { id: project.id },
        data: { status: 'in_progress' },
      });
    }

    if (missing.length > 0) {
      strapi.log.info(
        `Set default status for ${missing.length} project record(s).`,
      );
    }
  },
};
