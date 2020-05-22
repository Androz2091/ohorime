'use strict';
const mongoose = require('mongoose');

const authUserShema = {
  id: String,
  token: String,
};

module.exports = mongoose.model('Authuser', authUserShema);
