'use strict';
const Command = require('../../plugin/Command');
const language = require('../../translate');
const moment = require('moment');

/**
 * Command class
 */
class Nowplaying extends Command {
  /**
   * @param {Client} client - Client
   */
  constructor(client) {
    super(client, {
      name: 'nowplaying',
      category: 'music',
      description: 'command_nowplaying_description',
      usage: 'nowplaying',
      nsfw: false,
      enable: true,
      guildOnly: true,
      aliases: ['np'],
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
    if (!this.client.music[message.guild.id].dispatcher) {
      return message.channel.send(
          language(guild.lg, 'commande_music_not_played'),
      );
    };
    switch (this.client.music[message.guild.id].type) {
      case 'player':
        const duration =
          moment.duration({
            ms: guild.player_history[
                this.client.music[message.guild.id].index].time,
          });
        const progress =
         moment.duration({
           ms: this.client.music[message.guild.id].dispatcher.streamTime,
         });
        // eslint-disable-next-line max-len
        const progressBar = ['▬', '▬', '▬', '▬', '▬', '▬', '▬', '▬', '▬', '▬', '▬', '▬', '▬', '▬', '▬', '▬'];
        // eslint-disable-next-line max-len
        const calcul = Math.round(progressBar.length * (this.client.music[message.guild.id].dispatcher.streamTime/ (guild.player_history[
            this.client.music[message.guild.id].index].time)));
        progressBar[calcul] = '🔘';
        message.channel.send({
          embed: {
            color: '#2F3136',
            title: language(guild.lg, 'command_music_queue'),
            // eslint-disable-next-line max-len
            description: `[${
              guild.player_history[this.client.music[message.guild.id].index]
                  .snippet.title
            }](https://www.youtube.com/watch?v=${guild.player_history[this.client.music[message.guild.id].index].id.videoId})`,
            thumbnail: {
              url:
              guild.player_history[this.client.music[message.guild.id].index]
                  .snippet.thumbnails.default.url,
            },
            fields: [
              {
                name: 'Duration:',
                // eslint-disable-next-line max-len
                value: '[`' + progress.minutes() + ':' + progress.seconds() + '`] ' + progressBar.join('') + ' [`' + duration.minutes() + ':' + duration.seconds() + '`]',
              },
            ],
          },
        });
        break;
      case 'jpop':
        message.channel.send({
          embed: {
            color: '#2F3136',
            title: language(guild.lg, 'command_music_queue'),
            // eslint-disable-next-line max-len
            description: `[Jpop] ${this.client.jpop.data.song.title}${this.client.jpop.data.song.albums.length > 0 ?
                `${this.client.jpop.data.song.albums[0].nameRomanji ?
                `\n**name Romanji**: ${
                  this.client.jpop.data.song.albums[0].nameRomanji
                }` :
                ''}` :
                ''}\n**Song Duration**: ${
              this.convert(this.client.jpop.data.song.duration*1000).minutes
            }:${
              this.convert(this.client.jpop.data.song.duration*1000).seconds
            } minutes`,
            thumbnail: {
              url: `https://cdn.listen.moe/covers/${this.client.jpop.data.song.albums[0].image}`,
            },
          },
        });
        break;
      case 'kpop':
        message.channel.send({
          embed: {
            color: '#2F3136',
            title: language(guild.lg, 'command_music_queue'),
            // eslint-disable-next-line max-len
            description: `[Kpop] ${this.client.kpop.data.song.title}${this.client.kpop.data.song.albums.length > 0 ?
                  `${this.client.jpop.data.song.albums[0].nameRomanji ?
                  `\n**name Romanji**: ${
                    this.client.kpop.data.song.albums[0].nameRomanji
                  }` :
                  ''}` :
                  ''}\n**Song Duration**: ${
              this.convert(this.client.kpop.data.song.duration*1000).minutes
            }:${
              this.convert(this.client.kpop.data.song.duration*1000).seconds
            } minutes`,
            thumbnail: {
              url: `https://cdn.listen.moe/covers/${this.client.kpop.data.song.albums[0].image}`,
            },
          },
        });
        break;
      default:
        break;
    };
  };
  /**
   * convert seconde to minute
   * @param {Number} ms - seconde
   * @return {Number}
   */
  convert(ms) {
    const data = new Date(ms);
    return {
      seconds: data.getSeconds(),
      minutes: data.getMinutes(),
    };
  };
};

module.exports = Nowplaying;
