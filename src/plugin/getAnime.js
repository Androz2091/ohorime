'use strict';
const axios = require('axios');
const {ANEMY} = require('./../../configuration');
/**
 * Récupère les informations des/d'un animé(s)
 * @function
 * @async
 * @param {object} params - Element à rechercher
 * @param {boolean} pagination - Pagination
 * @return {object}
 * @example
 * getAnime({id: 1}, false).then(console.log);
 * getAnime({saison: '%2018'}, true).then(console.log);
 */
module.exports = async function(params, pagination) {
  console.log(params);
  return await axios({
    url: pagination ? 'https://api.anemy.fr/v1/page/anime' : 'https://api.anemy.fr/v1/anime/',
    method: 'POST',
    data: pagination ? {like: params} : {static: params},
    headers: {
      'Content-type': 'application/json',
      'Authorization': ANEMY.TOKEN,
    },
  }).then((r) => r.data).catch((e) => e);
};
