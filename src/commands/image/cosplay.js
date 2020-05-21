'use strict';
const Command = require('../../plugin/Command');
const language = require('../../translate');
const arisia = new (require('node-arisia'))({
  version: 1,
  token: require('./../../../configuration').ARISIA.token,
});

/**
 * Command class
 */
class Cosplay extends Command {
  /**
   * @param {Client} client - Client
   */
  constructor(client) {
    super(client, {
      name: 'cosplay',
      category: 'image',
      description: 'command_cosplay_description',
      usage: 'cosplay',
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
    const image = await arisia.images_simple.cosplay();
    return message.channel.send({
      embed: {
        color: guild.color,
        title: 'Cosplay',
        description:
          `[${language(guild.lg, 'command_img_notShow')}](${image.url})`,
        image: {
          url: image.url,
        },
      },
    });
  };
};

module.exports = Cosplay;
