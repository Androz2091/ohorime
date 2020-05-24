'use strict';
const Command = require('../../plugin/Command');
const language = require('../../translate');

/**
 * Command class
 */
class Jpop extends Command {
  /**
   * @param {Client} client - Client
   */
  constructor(client) {
    super(client, {
      name: 'jpop',
      category: 'music',
      description: 'command_broadcast_jpop_description',
      usage: 'jpop',
      nsfw: false,
      enable: true,
      guildOnly: false,
      aliases: [],
      mePerm: ['CONNECT', 'SPEAK', 'EMBED_LINKS'],
    });
    this.client = client;
  };
  /**
   * @param {Message} message - message
   * @param {Array} query - arguments
   * @param {Object} options - options
   * @param {Object} options.guild - guild data
   * @return {Message}
   */
  async launch(message, query, {guild}) {
    const player = new (require('./play'))(this.client);
    player.initQueue(this.client.music, message.guild.id);
    if (!message.guild.me.voice.channel) {
      if (!message.member.voice.channel) {
        return message.channel.send('Vous devez rejoindre le salon avant');
      };
      if (player.hasPermission(message)) {
        this.client.music[message.guild.id].connection =
          await message.member.voice.channel.join();
      } else {
        return message.reply('Vous ne pouvez pas ajouter le bot en vocal');
      };
    } else {
      if (!this.client.music[message.guild.id].connection) {
        this.client.music[message.guild.id].connection =
          await message.member.voice.channel.join();
      };
    };
    if (this.client.music[message.guild.id].dispatcher) {
      this.client.music[message.guild.id].dispatcher.destroy();
    };
    this.client.music[message.guild.id].connection =
      await message.member.voice.channel.join();
    this.client.music[message.guild.id].dispatcher =
      await this.client.music[message.guild.id].connection
          .play(this.client.jpop.broadcast);
    this.client.music[message.guild.id].broadcast = true;
    this.client.music[message.guild.id].type = 'jpop';
    message.channel.send({embed: {
      color: '#2F3136',
      description: language(guild.lg,
          'command_broadcast_actualPlaying')
          .replace('{{title}}', this.client.jpop.data.song.title),
      thumbnail: {
        url: `https://cdn.listen.moe/covers/${this.client.jpop.data.song.albums[0]?
        this.client.jpop.data.song.albums[0].image :
      ''}`,
      },
    },
    });
  };
};

module.exports = Jpop;
