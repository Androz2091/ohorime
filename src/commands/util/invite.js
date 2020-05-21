'use strict';
const Command = require('../../plugin/Command');

/**
 * Invite command
 */
class Invite extends Command {
  /**
   * @param {Client} client - Client
   */
  constructor(client) {
    super(client, {
      name: 'invite',
      category: 'util',
      description: 'command_invite_description',
      usage: 'invite',
      nsfw: false,
      enable: true,
      guildOnly: false,
      aliases: [],
      mePerm: [],
    });
    this.client = client;
  };
  /**
   * @param {Message} message - message
   * @return {Promise<Message>}
   */
  async launch(message) {
    /**
     * Send message
     */
    return message.channel.send(`https://discord.com/api/oauth2/authorize?client_id=704867756595478549&permissions=-1&redirect_uri=https%3A%2F%2Fohori.me%2Fdiscord%2Fcallback&scope=bot`);
  };
};

module.exports = Invite;
