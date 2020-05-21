/* eslint-disable */
'use strict';
const Command = require('../../plugin/Command');
const {Guild} = require('./../../database/lib/Guild');

/**
 * Command class
 */
class Top extends Command {
  /**
   * @param {Client} client - Client
   */
  constructor(client) {
    super(client, {
      name: 'top',
      category: 'leveling',
      description: 'command_top_description',
      usage: 'top',
      nsfw: false,
      enable: true,
      guildOnly: false,
      aliases: ['levels'],
      mePerm: ['EMBED_LINKS'],
    });
    this.client = client;
  };
  /**
   * @param {Message} message - message
   * @param {Array} query - query
   * @param {Object} options - options
   * @param {Object} options.guild - guild data
   * @param {Object} options.user - user data
   * @return {Message}
   */
  async launch(message, query, {guild, user}) {
    console.log(await Guild.find());
  };
};

module.exports = Top;
