'use strict';
const mongoose = require('mongoose');

const guildShema = {
  name: String,
  id: String,
  prefix: String,
  color: String,
  language: {
    'type': String,
    'default': 'en',
  },
  banner: {
    'type': Object,
    'default': {
      id: 0,
      extension: ['webp', 'png'],
    },
  },
  welcome: {
    'type': Object,
    'default': {
      banner: String,
      channel: null,
      active: false,
    },
  },
  goodbye: {
    'type': Object,
    'default': {
      banner: String,
      channel: null,
      avtive: false,
    },
  },
  player: {
    'type': Object,
    'default': {
      history: Array,
      volume: 50,
      loop: 'off',
      muteIndicator: false,
    },
  },
  mute: {
    'type': Object,
    'default': {
      role: null,
      affectVocal: false,
      channels: Map,
    },
  },
  messageCount: {
    'type': Number,
    'default': 0,
  },
  dailyActivity: {
    'type': Array,
    'default': [
      {day: new Date().getDate(), month: new Date().getMonth(),
        year: new Date().getFullYear(), messages: 0},
    ],
  },
};

module.exports = mongoose.model('Guild', guildShema);
