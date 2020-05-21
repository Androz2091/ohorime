'use strict';
const Command = require('../../plugin/Command');
const {sfw} = new (require('nekos.life'))();

/**
 * Command class
 */
class Cattext extends Command {
  /**
   * @param {Client} client - Client
   */
  constructor(client) {
    super(client, {
      name: 'cattext',
      category: 'fun',
      description: 'command_cattext_description',
      usage: 'cattext',
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
    const data = await sfw.catText();
    return message.channel.send(data.cat)
        .catch(console.error);
  };
};

module.exports = Cattext;
