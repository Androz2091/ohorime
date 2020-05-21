'use strict';
const Command = require('../../plugin/Command');
const language = require('../../translate');

/**
 * Lmgtfy command
 */
class Lmgtfy extends Command {
  /**
   * @param {Client} client - Client
   */
  constructor(client) {
    super(client, {
      name: 'lmgtfy',
      category: 'util',
      description: 'command_lmgtfy_description',
      usage: 'lmgtft [research]',
      nsfw: false,
      enable: true,
      guildOnly: false,
      aliases: [],
    });
    this.client = client;
  };
  /**
   * @param {Message} message - message
   * @param {Array<Message>} query - query
   * @param {Object} options - options
   * @param {Object} options.guild - guild data
   * @return {Promise<Message>}
   */
  launch(message, query, {guild}) {
    /**
     * Check if it's query
     */
    if (!query.join(' ')) {
      /**
       * Send message
       */
      return message.channel.send(language(guild.language, 'value_not_found'));
    };
    /**
     * Send message
     */
    return message.channel.send(`https://${guild.language}.lmgtfy.com/?q=${query.join('+')}&iie=1`);
  };
};

module.exports = Lmgtfy;
