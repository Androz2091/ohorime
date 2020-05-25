'use strict';
const Command = require('../../plugin/Command');
const language = require('../../i18n');
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
      usage: 'owoify [text]',
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
      return message.reply(language(guild.lg, 'command_owoify_requireValue'));
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
