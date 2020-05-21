'use strict';
const Command = require('../../plugin/Command');
const arisia = new (require('node-arisia'))({
  version: 1,
  token: require('./../../../configuration').ARISIA.token,
});
const {MessageAttachment} = require('discord.js');

/**
 * Command class
 */
class Triggered extends Command {
  /**
   * @param {Client} client - Client
   */
  constructor(client) {
    super(client, {
      name: 'triggered',
      category: 'image',
      description: 'command_triggered_description',
      usage: 'triggered (mentions)',
      nsfw: false,
      enable: true,
      guildOnly: false,
      aliases: [],
      mePerm: ['ATTACH_FILES'],
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
    const queryMember = query.join(' ');
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
    const image = await arisia.animes.triggered({
      url: member.user.displayAvatarURL({
        format: 'png',
      }),
    });
    const attachment =
      new MessageAttachment(image.url, `triggered-${member.displayName}.gif`);
    return message.channel.send({files: [attachment]});
  };
};

module.exports = Triggered;
