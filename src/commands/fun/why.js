'use strict';
const Command = require('../../plugin/Command');
const {sfw} = new (require('nekos.life'))();

/**
 * Command class
 */
class Why extends Command {
  /**
   * @param {Client} client - Client
   */
  constructor(client) {
    super(client, {
      name: 'why',
      category: 'fun',
      description: 'command_why_description',
      usage: 'why',
      nsfw: false,
      enable: true,
      guildOnly: false,
      aliases: [],
    });
    this.client = client;
  };
  /**
   * @param {Message} message - message
   * @return {Message}
   */
  async launch(message) {
    const data = await sfw.why();
    return message.reply(data.why)
        .catch(console.error);
  };
};

module.exports = Why;
