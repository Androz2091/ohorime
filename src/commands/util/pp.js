'use strict';
const Command = require('../../plugin/Command');

/**
 * Pp command
 */
class Pp extends Command {
  /**
   * @param {Client} client - Client
   */
  constructor(client) {
    super(client, {
      name: 'pp',
      category: 'util',
      description: 'command_pp_description',
      usage: 'pp (@member)',
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
   * @param {Array<String>} query - query
   * @param {Object} options - options
   * @param {Object} options.guild - guild data
   * @return {Promise<Message>}
   */
  async launch(message, query, {guild}) {
    /**
     * Get member query
     */
    const queryMember = query.join(' ');
    /**
     * Get member
     */
    const member = message.mentions.members.first() ||
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
          member.toString() === queryMember) ||
        message.member;
    /**
     * Send message
     */
    return message.channel.send({
      embed: {
        color: guild.color,
        title: `${member.displayName} avatar`,
        description:
          `[download picture](${
            member.user.displayAvatarURL({
              size: 2048,
              dynamic: true,
              format: 'png',
            })
          })`,
        image: {
          url: member.user.displayAvatarURL({
            size: 2048,
          }),
        },
      },
    });
  };
};

module.exports = Pp;
