'use strict';
const Command = require('../../plugin/Command');

/**
   * Command class
   */
class Watchlist extends Command {
  /**
     * @param {Client} client - Client
     */
  constructor(client) {
    super(client, {
      name: 'watchlist',
      category: 'japanese',
      description: 'command_watchlist_description',
      usage: 'watchlist',
      nsfw: false,
      enable: true,
      guildOnly: false,
      aliases: [],
      mePerm: ['EMBED_LINKS'],
    });
    this.client = client;
  };
  /**
     * @param {Message} message - message
     * @param {Array} query - query
     * @param {Object} options - options
     * @param {Object} options.guild - guild data
     * @return {Message}
     */
  async launch(message, query, {guild}) {
    return message.channel.send({
      embed: {
        description: `Please login you with anemy: https://ohori.me/callback/anemy`,
      },
    });
  };
};

module.exports = Watchlist;
