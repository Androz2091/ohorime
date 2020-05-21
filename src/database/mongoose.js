'use strict';
const mongoose = require('mongoose');
const {MONGODB: db} = require('./../../configuration');

module.exports = {
  init: () => {
    // eslint-disable-next-line max-len
    mongoose.connect(`${db.PROTOCOL}${db.USER.USERNAME}:${db.USER.PWD}@${db.ADDRESS}:${db.PORT}/${db.DATABASE}`, db.OPTIONS);
    mongoose.Promise = global.Promise;
    mongoose.connection.on('connected', () =>
      console.log('Mongoose connecté !'));
    mongoose.connection.on('disconnected', () =>
      console.log('Mongoose déconnecté !'));
  },
};
