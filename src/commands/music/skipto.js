'use strict';
const Command = require('../../plugin/Command');
const language = require('../../i18n');

/**
 * Command class
 */
class Skipto extends Command {
  /**
   * @param {Client} client - Client
   */
  constructor(client) {
    super(client, {
      name: 'skipto',
      category: 'music',
      description: 'command_skipto_description',
      usage: 'skipto [number]',
      nsfw: false,
      enable: true,
      guildOnly: true,
      aliases: [],
      mePerm: [
        'EMBED_LINKS',
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
    if (!this.client.music[message.guild.id]) return message.react('💢');
    if (this.client.music[message.guild.id].dispatcher === null) {
      return message.reply(language(guild.lg, 'command_music_notPlaying'));
    };
    const player = new (require('./play'))(this.client);
    if (!player.hasPermission(message)) {
      return message.channel.send(
          language(guild.lg, 'command_skipto_noPermission'),
      );
    };
    if (this.client.music[message.guild.id].broadcast) {
      return message.reply('⚠️');
    };
    if (isNaN(query.join(' '))) {
      return message.reply(
          language(guild.lg, 'value_is_not_a_number'),
      );
    };
    if (query.join(' ') > guild.player_history-1) return message.react('💢');
    switch (guild.player_loop) {
      case 'off':
        guild.player_history = guild.player_history.slice(query.join(' ')-1);
        guild = await player.updateQueue(guild.player_history, message);
        this.client.music[message.guild.id].index = 0;
        player.play(message, guild);
        break;
      default:
        await this.client.music[message.guild.id].dispatcher.destroy();
        guild = await player.updateQueue(guild.player_history, message);
        this.client.music[message.guild.id].index = query.join(' ')-1;
        player.play(message, guild);
        break;
    }
  };
};

module.exports = Skipto;
