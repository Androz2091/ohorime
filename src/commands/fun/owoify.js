'use strict';
const Command = require('../../plugin/Command');
const language = require('../../translate');
const {sfw} = new (require('nekos.life'))();

/**
 * Command class
 */
class Owoify extends Command {
  /**
   * @param {Client} client - Client
   */
  constructor(client) {
    super(client, {
      name: 'owoify',
      category: 'fun',
      description: 'command_owoify_description',
      usage: 'owoify',
      nsfw: false,
      enable: true,
      guildOnly: false,
      aliaseseses: [],
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
    if (!query.join(' ')) {
      return message.reply(language(guild.lg, 'value_not_found'));
    };
    // eslint-disable-next-line new-cap
    const data = await sfw.OwOify({
      text: query.join(' '),
    });
    return message.channel.send(data.owo)
        .catch(console.error);
  };
};

module.exports = Owoify;
