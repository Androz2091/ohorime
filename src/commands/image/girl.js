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
class Girl extends Command {
  /**
   * @param {Client} client - Client
   */
  constructor(client) {
    super(client, {
      name: 'girl',
      category: 'image',
      description: 'command_girl_description',
      usage: 'girl',
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
    const image = await arisia.images_simple.girl();
    return message.channel.send({
      embed: {
        color: guild.color,
        title: 'Girl',
        description:
          `[${language(guild.lg, 'command_img_notShow')}](${image.url})`,
        image: {
          url: image.url,
        },
      },
    });
  };
};

module.exports = Girl;
