'use strict';
const Command = require('../../plugin/Command');
const language = require('../../translate');

/**
 * Command class
 */
class Skip extends Command {
  /**
   * @param {Client} client - Client
   */
  constructor(client) {
    super(client, {
      name: 'skip',
      category: 'music',
      description: 'command_skip_description',
      usage: 'skip',
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
    if (!this.client.music[message.guild.id]) return message.react('💢');
    if (this.client.music[message.guild.id].dispatcher === null) {
      return message.reply(language(guild.lg, 'command_music_notPlaying'));
    };
    const player = new (require('./play'))(this.client);
    const joining = await player.join(message);
    if (joining === 'PLAYING') {
      return message.channel.send('Vous ne pouvez pas coupé la musique');
    };
    if (this.client.music[message.guild.id].broadcast) {
      return message.reply('⚠️');
    };
    switch (guild.player.loop) {
      case 'off':
        guild.player.history.shift();
        guild = await player.updateQueue(guild.player, message);
        player.play(message, guild);
        break;
      default:
        await this.client.music[message.guild.id].dispatcher.destroy();
        guild = await player.updateQueue(guild.player, message);
        if (this.client.music[message.guild.id].index ===
            guild.player.history.length - 1) {
          this.client.music[message.guild.id].index = 0;
        } else {
          this.client.music[message.guild.id].index++;
        };
        player.play(message, guild);
        break;
    }
  };
};

module.exports = Skip;
