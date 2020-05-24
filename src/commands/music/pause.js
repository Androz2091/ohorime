'use strict';
const Command = require('../../plugin/Command');
const language = require('../../translate');

/**
 * Command class
 */
class Pause extends Command {
  /**
   * @param {Client} client - Client
   */
  constructor(client) {
    super(client, {
      name: 'pause',
      category: 'music',
      description: 'command_pause_description',
      usage: 'pause',
      nsfw: false,
      enable: true,
      guildOnly: true,
      aliases: ['stop'],
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
    if (!this.client.music[message.guild.id]) return message.react('💢');
    if (this.client.music[message.guild.id].dispatcher === null) {
      return message.reply(language(guild.lg, 'command_music_notPlaying'));
    };
    const player = new (require('./play'))(this.client);
    if (!player.hasPermission(message)) {
      return message.channel.send('You do not have permission');
    };
    if (joining === 'PLAYING') {
      return message.channel.send('Vous ne pouvez pas coupé la musique');
    };
    if (this.client.music[message.guild.id].broadcast) {
      return message.reply('⚠️');
    };
    if (!this.client.music[message.guild.id].isPlaying) {
      return message.reply(language(guild.lg, 'command_music_isPause'));
    };
    this.client.music[message.guild.id].dispatcher.pause();
    this.client.music[message.guild.id].isPlaying = false;
  };
};

module.exports = Pause;
