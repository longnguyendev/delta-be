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
     * Những field mới thêm vào Project có thể còn null ở các bản ghi cũ.
     * Enum project_state và các field bắt buộc (is_featured, priority) không
     * được phép null trong GraphQL, nên gán giá trị mặc định một lần.
     */
    const projects = await strapi.db.query('api::project.project').findMany({
      select: ['id', 'project_state', 'is_featured', 'priority'],
    });

    let repaired = 0;

    for (const project of projects) {
      const data = {};

      if (project.project_state == null) data.project_state = 'in_progress';
      if (project.is_featured == null) data.is_featured = false;
      if (project.priority == null) data.priority = 0;

      if (Object.keys(data).length > 0) {
        await strapi.db.query('api::project.project').update({
          where: { id: project.id },
          data,
        });
        repaired += 1;
      }
    }

    if (repaired > 0) {
      strapi.log.info(
        `Set default project fields for ${repaired} project record(s).`,
      );
    }
  },
};
