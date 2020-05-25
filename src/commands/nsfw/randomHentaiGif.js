'use strict';
const Command = require('../../plugin/Command');
const language = require('../../i18n');
const {nsfw} = new (require('nekos.life'))();

/**
 * Command class
 */
class RandomHentaiGif extends Command {
  /**
   * @param {Client} client - Client
   */
  constructor(client) {
    super(client, {
      name: 'randomhentaigif',
      category: 'nsfw',
      description: 'command_randomhentaigif_description',
      usage: 'randohentaigif',
      nsfw: true,
      enable: true,
      guildOnly: false,
      aliases: ['rhg'],
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
    const image = await nsfw.randomHentaiGif();
    return message.channel.send({
      embed: {
        color: guild.color,
        title: 'randomHentaiGif',
        description:
          `[${language(guild.lg, 'command_img_notShow')}](${image.url})`,
        image: {
          url: image.url,
        },
      },
    });
  };
};

module.exports = RandomHentaiGif;
