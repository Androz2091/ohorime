'use strict';
const Command = require('../../plugin/Command');
const language = require('../../translate');
const {sfw} = new (require('nekos.life'))();

/**
 * Command class
 */
class Baka extends Command {
  /**
   * @param {Client} client - Client
   */
  constructor(client) {
    super(client, {
      name: 'baka',
      category: 'social',
      description: 'command_baka_description',
      usage: 'baka (mentions)',
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
    let self = false;
    const queryMember = query.join(' ');
    let member = message.mentions.members.first() ||
        message.guild.member(
            message.mentions.users.first(),
        ) ||
        message.guild.members.cache.find((member) =>
          member.id === queryMember) ||
        message.guild.members.cache.find((member) =>
          member.displayName === queryMember) ||
        message.guild.members.cache.find((member) =>
          member.user.username === queryMember) ||
        message.guild.members.cache.find((member) =>
          member.toString() === queryMember);
    if (!member) {
      member = message.member;
      self = true;
    };
    const image = await sfw.baka();
    return message.channel.send({
      embed: {
        color: guild.color,
        title: self ? `${member.displayName} baka` :
          `${message.member.displayName} baka ${member.displayName}`,
        description:
          `[${language(guild.lg, 'command_img_notShow')}](${image.url})`,
        image: {
          url: image.url,
        },
      },
    });
  };
};

module.exports = Baka;
