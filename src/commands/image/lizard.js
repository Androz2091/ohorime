'use strict';
const Command = require('../../plugin/Command');
const language = require('../../translate');
const {sfw} = new (require('nekos.life'))();

/**
 * Command class
 */
class Lizard extends Command {
  /**
   * @param {Client} client - Client
   */
  constructor(client) {
    super(client, {
      name: 'lizard',
      category: 'image',
      description: 'command_lizard_description',
      usage: 'lizard',
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
    const image = await sfw.lizard();
    return message.channel.send({
      embed: {
        color: guild.color,
        title: 'Lizard',
        description:
          `[${language(guild.lg, 'command_img_notShow')}](${image.url})`,
        image: {
          url: image.url,
        },
      },
    });
  };
};

module.exports = Lizard;
