'use strict';
const Command = require('../../plugin/Command');

/**
 * Command class
 */
class muteindicator extends Command {
  /**
   * @param {Client} client - Client
   */
  constructor(client) {
    super(client, {
      name: 'muteindicator',
      category: 'music',
      description: 'command_muteindicator_description',
      usage: 'queue',
      nsfw: false,
      enable: true,
      guildOnly: true,
      aliases: [],
      mePerm: [
        'CONNECT',
        'SPEAK',
        'EMBED_LINKS',
        'ADD_REACTIONS',
        'MANAGE_MESSAGES',
      ],
    });
    this.client = client;
  };
  /**
   * @param {Message} message - message
   * @param {Array} query - argument
   * @param {Object} options - options
   * @param {Object} options.guild - guild data
   * @return {Message}
   */
  async launch(message, query, {guild}) {
    if (guild.player_muteIndicator) {
      guild.player_muteindicator = false;
      await this.client.updateGuild(message.guild, {
        player_muteIndicator: guild.player_muteIndicator,
      });
      return message.react('❌');
    } else {
      guild.player_muteIndicator = true;
      await this.client.updateGuild(message.guild, {
        player_muteIndicator: guild.player_muteIndicator,
      });
      return message.react('⭕');
    };
  };
};

module.exports = muteindicator;
