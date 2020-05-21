'use strict';
const entitiesDecoder = require('html-entities-decoder');
/**
 * Convert html to markdown x js
 * @param {String} str - html string
 * @return {String}
 */
module.exports = function(str) {
  return entitiesDecoder(str);
};
