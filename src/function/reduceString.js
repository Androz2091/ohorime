'use strict';

/**
 * Reduce string
 * @param {String} str
 * @param {Number} num
 * @return {String}
 */
module.exports = function(str, num = 2000) {
  return str.length > num ? str.substr(0, num-3) + '...' : str;
};
