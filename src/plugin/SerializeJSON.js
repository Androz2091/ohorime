'use stric';

/**
 * Convert json to array of objects
 * @param {Object} json
 * @return {Array} - JSON serialized
 */
module.exports = function(json) {
  /**
   * Array Serializer
   */
  const serialize = [];
  /**
   * Add id key to item object
   */
  Object.keys(json).forEach((v, i) => {
    json[v].id = v;
    serialize.push(json[v]);
  });

  return serialize;
};
