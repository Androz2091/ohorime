'use strict';
const Command = require('../../plugin/Command');

/**
 * Command class
 */
class Leave extends Command {
  /**
   * @param {Client} client - Client
   */
  constructor(client) {
    super(client, {
      name: 'leave',
      category: 'music',
      description: 'command_leave_description',
      usage: 'leave',
      nsfw: false,
      enable: true,
      guildOnly: true,
      aliases: ['disconnect'],
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
    const joining = await player.join(message);
    if (joining === 'PLAYING') {
      return message.channel.send('Vous ne pouvez pas coupé la musique');
    };
    if (!this.client.music[message.guild.id]) {
      return message.channel.send('Je ne suis pas dans un salon');
    };
    if (this.client.music[message.guild.id].dispatcher) {
      this.client.music[message.guild.id].dispatcher.destroy();
    };
    this.client.music[message.guild.id].dispatcher = null;
    await message.guild.me.voice.channel.leave();
    this.client.music[message.guild.id].connection = null;
  };
};

module.exports = Leave;
