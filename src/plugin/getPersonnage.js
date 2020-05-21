'use strict';
const {ANEMY} = require('./../../configuration');
const axios = require('axios');

/**
 * Récupere les informations des/d'un personnage(s)
 * @function
 * @async
 * @param {Object} params - Element à rechercher
 * @param {Boolean} pagination - Pagination
 * @return {Object}
 * @example
 * getPersonnage({id: 50}, false).then(console.log);
 * getPersonnage({prenom: 'Sakura'}, true).then(console.log);
 */
module.exports = async function(params, pagination) {
  return await axios({
    url: pagination ? 'https://api.anemy.fr/v1/page/personnage' : 'https://api.anemy.fr/v1/personnage/',
    method: 'POST',
    data: pagination ? {like: params} : {static: params},
    headers: {
      'Content-type': 'application/json',
      'Authorization': ANEMY.TOKEN,
    },
  }).then((r) => r.data).catch((e) => e);
};
