'use strict';
const Command = require('../../plugin/Command');
const language = require('../../i18n');
const {nsfw} = new (require('nekos.life'))();

/**
 * Command class
 */
class Futunari extends Command {
  /**
   * @param {Client} client - Client
   */
  constructor(client) {
    super(client, {
      name: 'futinari',
      category: 'nsfw',
      description: 'command_futinari_description',
      usage: 'futinari',
      nsfw: true,
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
    const image = await nsfw.futinari();
    return message.channel.send({
      embed: {
        color: guild.color,
        title: 'futinari',
        description:
          `[${language(guild.lg, 'command_img_notShow')}](${image.url})`,
        image: {
          url: image.url,
        },
      },
    });
  };
};

module.exports = Futunari;
