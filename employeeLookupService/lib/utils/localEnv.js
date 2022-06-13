'use strict';

/**
 * @returns {boolean} If application is running on local mode
 */
function isLocalEnv() {
  return process.env.NODE_ENV === 'local';
}

module.exports = isLocalEnv;
