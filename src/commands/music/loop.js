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
        'ADD_REACTIONS',
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
      return message.reply(
          language(guild.lg, 'command_loop_repeat_radio'),
      );
    } else if (!this.client.music[message.guild.id].dispatcher) {
      return message.reply(
          language(guild.lg, 'command_loop_noPlaying'),
      );
    };
    switch (query.join('')) {
      case 'off':
        guild.player_loop = 'off';
        await this.client.updateGuild(message.guild, {
          player_loop: guild.player_loop,
        });
        message.react('➡️');
        break;
      case 'on':
        guild.player_loop = 'on';
        await this.client.updateGuild(message.guild, {
          player_loop: guild_player_loop,
        });
        message.react('🔁');
        break;
      case 'once':
        guild.player_loop = 'once';
        await this.client.updateGuild(message.guild, {
          player_loop: guild_player,
        });
        message.react('🔂');
        break;
      default:
        if (guild.player.loop === 'off') {
          guild.player_loop = 'on';
          await this.client.updateGuild(message.guild, {
            player_loop: guild_player,
          });
          message.react('🔁');
        } else if (guild.player.loop === 'on') {
          guild.player_loop = 'once';
          await this.client.updateGuild(message.guild, {
            player_loop: guild.player_loop,
          });
          message.react('🔂');
        } else if (guild.player.loop === 'once') {
          guild.player_loop = 'off';
          await this.client.updateGuild(message.guild, {
            player_loop: guild.player_loop,
          });
          message.react('➡️');
        };
        break;
    }
  };
};

module.exports = Loop;
