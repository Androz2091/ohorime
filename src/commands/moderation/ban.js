'use strict';
const Command = require('../../plugin/Command');
const language = require('../../translate');

/**
 * Command class
 */
class Ban extends Command {
  /**
   * @param {Client} client - Client
   */
  constructor(client) {
    super(client, {
      name: 'ban',
      category: 'moderation',
      description: 'command_ban_description',
      usage: 'ban (username | nickname | id) [days | reason] [reason]',
      nsfw: false,
      enable: true,
      guildOnly: true,
      aliases: [],
      mePerm: ['BAN_MEMBERS'],
      userPerm: ['BAN_MEMBERS'],
    });
    this.client = client;
  };
  /**
   * @param {Message} message - message
   * @param {Array} query - arguments
   * @param {Object} options - options
   * @param {Object} options.guild - guild data
   * @return {Message|GuildMember}
   */
  launch(message, query, {guild}) {
    const queryMember = query.shift();
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
          member.toString() === queryMember);
    if (!member) {
      return message.reply(language(guild.lg, 'member_not_found'));
    };
    if (message.member.roles.highest.position < member.roles.highest.position) {
      return message.reply(language(guild.lg, 'command_ban_invalidPosition'));
    };
    if (message.guild.me.roles.highest.position <
        member.roles.highest.posisiton) {
      return message.reply(
          language(guild.lg, 'command_ban_MeInvalidePosition'),
      );
    };
    let suposedDay = 0;
    let suposedReason;
    if (isNaN(query[0])) {
      suposedReason = query.join(' ');
    } else {
      suposedDay = query.shift();
      suposedReason = query.join(' ');
    };
    let errored = false;
    return member.ban({days: suposedDay, reason: suposedReason})
        .catch((err) => {
          console.error(err);
          errored = true;
          message.channel.send(language(guild.lg, 'command_ban_error'));
          message.channel.send(err, {code: 'js'});
        }).then(() => {
          if (!errored) {
            message.channel.send(language(guild.lg, 'command_ban_success'));
          };
        });
  };
};

module.exports = Ban;
