'use strict';
const mongoose = require('mongoose');

const userShema = {
  name: String,
  id: String,
  messageCount: {
    'type': Number,
    'default': 0,
  },
  coins: {
    'type': Number,
    'default': 1000,
  },
  items: Array,
  banner: {
    'type': Object,
    'default': {
      id: '001',
      extension: ['webp', 'png'],
    },
  },
  musicFavorite: Object,
  upvote: {
    'type': Object,
    'default': {
      count: 0,
      timeout: Date.now() - 21600000,
    },
  },
  dailyActivity: {
    'type': Array,
    'default': [
      {day: new Date().getDate(), month: new Date().getMonth(),
        year: new Date().getFullYear(), messages: 0},
    ],
  },
};

module.exports = mongoose.model('User', userShema);
