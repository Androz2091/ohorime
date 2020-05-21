'use strict';
const Command = require('../../plugin/Command');

/**
 * Command class
 */
class Loop extends Command {
  /**
   * @param {Client} client - Client
   */
  constructor(client) {
    super(client, {
      name: 'loop',
      category: 'music',
      description: 'command_loop_description',
      usage: 'pause',
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
    const player = new (require('./play'))(this.client);
    await player.initQueue(this.client.music, message.guild.id);
    if (this.client.music[message.guild.id].broadcast) {
      return message.reply('Vous ne pouvez pas répéter une radio');
    } else if (!this.client.music[message.guild.id].dispatcher) {
      return message.reply('Je ne joue pas de musique');
    };
    switch (query.join('')) {
      case 'off':
        guild.player.loop = 'off';
        await this.client.updateGuild(message.guild, {
          player: guild.player,
        });
        message.react('➡️');
        break;
      case 'on':
        guild.player.loop = 'on';
        await this.client.updateGuild(message.guild, {
          player: guild.player,
        });
        message.react('🔁');
        break;
      case 'once':
        guild.player.loop = 'once';
        await this.client.updateGuild(message.guild, {
          player: guild.player,
        });
        message.react('🔂');
        break;
      default:
        if (guild.player.loop === 'off') {
          guild.player.loop = 'on';
          await this.client.updateGuild(message.guild, {
            player: guild.player,
          });
          message.react('🔁');
        } else if (guild.player.loop === 'on') {
          guild.player.loop = 'once';
          await this.client.updateGuild(message.guild, {
            player: guild.player,
          });
          message.react('🔂');
        } else if (guild.player.loop === 'once') {
          guild.player.loop = 'off';
          await this.client.updateGuild(message.guild, {
            player: guild.player,
          });
          message.react('➡️');
        };
        break;
    }
  };
};

module.exports = Loop;
