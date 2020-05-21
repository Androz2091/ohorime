'use strict';
const Command = require('../../plugin/Command');
const moment = require('moment');

/**
 * Command class
 */
class Upvote extends Command {
  /**
   * @param {Client} client - Client
   */
  constructor(client) {
    super(client, {
      name: 'upvote',
      category: 'leveling',
      description: 'command_upvote_description',
      usage: 'upvote',
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
   * @param {Object} options.user - user data
   * @return {Message}
   */
  async launch(message, query, {guild, user}) {
    if (Date.now() < (user.upvote.timeout + 21600000)) {
      // eslint-disable-next-line max-len
      return message.channel.send(`Vous devez attendre ${moment((user.upvote.timeout+21600000)-Date.now()).format('h:mm:ss')}`);
    };
    const member = message.mentions.members.first() ||
        message.guild.member(
            message.mentions.users.first(),
        ) ||
        message.guild.members.cache.find((member) =>
          member.id === query.join('')) ||
        message.guild.members.cache.find((member) =>
          member.displayName.toLowerCase().trim() === query.join('')) ||
        message.guild.members.cache.find((member) =>
          member.user.username.toLowerCase().trim() === query.join('')) ||
        message.guild.members.cache.find((member) =>
          member.toString() === query.join(''));
    if (!member) {
      return message.channel.send('Je ne trouve pas l\'utilisateur');
    };
    message.channel.send(`Vous avez upvote ${member.user.tag}`);
    let memberData = await this.client.getUser(member.user);
    if (!memberData) {
      memberData = await this.client.createUser({
        name: member.user.username,
        id: member.user.id,
      });
    };
    memberData.upvote.count = Number(memberData.upvote.count) + 1;
    this.client.updateUser(member.user, {
      upvote: memberData.upvote,
    });
    user.upvote.timeout = Date.now();
    this.client.updateUser(message.author, {
      upvote: user.upvote,
    });
  };
};

module.exports = Upvote;
