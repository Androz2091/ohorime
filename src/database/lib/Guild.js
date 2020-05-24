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
  welcome_banner: String,
  welcome_channel: String,
  welvome_active: {
    'type': Boolean,
    'default': false,
  },
  goodbye_banner: String,
  goodbye_channel: String,
  goodbye_active: {
    'type': Boolean,
    'default': false,
  },
  player_history: Array,
  player_volume: {
    'type': Number,
    'default': 50,
  },
  player_loop: {
    'type': String,
    'default': 'off',
  },
  player_muteIndicator: {
    'type': Boolean,
    'default': false,
  },
  mute_role: String,
  mute_affectVocal: {
    'type': Boolean,
    'default': false,
  },
  mute_channels: Object,
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
