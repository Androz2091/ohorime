'use strict';
const axios = require('axios');
const {ANEMY} = require('./../../configuration');
/**
 * Récupere les informations des/d'un staff
 * @function
 * @async
 * @param {Object} params - Element à rechercher
 * @param {Boolean} pagination - Pagination
 * @return {Object}
 * @example
 * getStaff({id: 50}, false).then(console.log);
 * getStaff({prenom: 'Tatsuya'}, true).then(console.log);
 */
module.exports = async function(params, pagination) {
  return await axios({
    url: pagination ? 'https://api.anemy.fr/v1/page/staff' : 'https://api.anemy.fr/v1/staff/',
    method: 'POST',
    data: pagination ? {like: params} : {static: params},
    headers: {
      'Content-type': 'application/json',
      'Authorization': ANEMY.TOKEN,
    },
  }).then((r) => r.data).catch((e) => e);
};
