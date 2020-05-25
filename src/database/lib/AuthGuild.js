'use strict';
const mongoose = require('mongoose');

const authGuildShema = {
  id: String,
  token: String,
};

module.exports = mongoose.model('AuthGuild', authGuildShema);
