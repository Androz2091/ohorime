'use strict';
const Command = require('../../plugin/Command');
const language = require('../../i18n');
const {sfw} = new (require('nekos.life'))();

/**
 * Command class
 */
class Kemonomimi extends Command {
  /**
   * @param {Client} client - Client
   */
  constructor(client) {
    super(client, {
      name: 'kemonomimi',
      category: 'image',
      description: 'command_kemonomimi_description',
      usage: 'kemonomimi',
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
    const image = await sfw.kemonomimi();
    return message.channel.send({
      embed: {
        color: guild.color,
        title: 'Kemonomimi',
        description:
          `[${language(guild.lg, 'command_img_notShow')}](${image.url})`,
        image: {
          url: image.url,
        },
      },
    });
  };
};

module.exports = Kemonomimi;
