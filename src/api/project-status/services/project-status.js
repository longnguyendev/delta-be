'use strict';

/**
 * project-status service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::project-status.project-status');
