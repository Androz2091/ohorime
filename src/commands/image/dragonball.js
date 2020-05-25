'use strict';
const Command = require('../../plugin/Command');
const language = require('../../i18n');
const arisia = new (require('node-arisia'))({
  version: 1,
  token: require('./../../../configuration').ARISIA.token,
});

/**
 * Command class
 */
class Dragonball extends Command {
  /**
   * @param {Client} client - Client
   */
  constructor(client) {
    super(client, {
      name: 'dragonball',
      category: 'image',
      description: 'command_dragonball_description',
      usage: 'dragonball',
      nsfw: false,
      enable: true,
      guildOnly: false,
      aliases: ['db'],
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
    const image = await arisia.images_simple.dragonball();
    return message.channel.send({
      embed: {
        color: guild.color,
        title: 'Dragonball',
        description:
          `[${language(guild.lg, 'command_img_notShow')}](${image.url})`,
        image: {
          url: image.url,
        },
      },
    });
  };
};

module.exports = Dragonball;
