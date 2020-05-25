'use strict';
const Command = require('../../plugin/Command');
const language = require('../../i18n');

/**
 * Command class
 */
class Kick extends Command {
  /**
   * @param {Client} client - Client
   */
  constructor(client) {
    super(client, {
      name: 'kick',
      category: 'moderation',
      description: 'command_kick_description',
      usage: 'kick (username | nickname | id) [reason]',
      nsfw: false,
      enable: true,
      guildOnly: true,
      aliases: [],
      mePerm: ['KICK_MEMBERS'],
      userPerm: ['KICK_MEMBERS'],
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
      return message.reply(language(guild.lg, 'command_kick_invalidPosition'));
    };
    if (message.guild.me.roles.highest.position <
        member.roles.highest.posisiton) {
      return message.reply(
          language(guild.lg, 'command_kick_MeInvalidePosition'),
      );
    };
    let errored = false;
    return member.kick({reason: query.join(' ')}).catch((err) => {
      console.log(err);
      errored = true;
      message.channel.send(language(guild.lg, 'command_kick_error'));
      return message.channel.send(err, {code: 'js'});
    }).then(() => {
      console.log(errored);
      if (!errored) {
        message.channel.send(language(guild.lg, 'command_kick_success'));
      };
    });
  };
};

module.exports = Kick;
