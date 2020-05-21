'use strict';
const Command = require('../../plugin/Command');
const language = require('../../translate');
const {sfw} = new (require('nekos.life'))();

/**
 * Command class
 */
class Slap extends Command {
  /**
   * @param {Client} client - Client
   */
  constructor(client) {
    super(client, {
      name: 'slap',
      category: 'social',
      description: 'command_slap_description',
      usage: 'slap (mentions)',
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
    const image = await sfw.slap();
    return message.channel.send({
      embed: {
        color: guild.color,
        title: self ? `${member.displayName} slap` :
          `${message.member.displayName} slap ${member.displayName}`,
        description:
          `[${language(guild.lg, 'command_img_notShow')}](${image.url})`,
        image: {
          url: image.url,
        },
      },
    });
  };
};

module.exports = Slap;
