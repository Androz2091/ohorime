/* eslint-disable max-len */
'use strict';
const Command = require('../../plugin/Command');
const language = require('../../translate');
const ytdl = require('ytdl-core');
const {YOUTUBE_KEY} = require('../../../configuration');
const axios = require('axios');
const {MessageCollector} = require('discord.js');
const htmlEntitiesDecoder = require('html-entities-decoder');

/**
 * Play command
 */
class Play extends Command {
  /**
   * @param {Client} client - Client
   */
  constructor(client) {
    super(client, {
      name: 'play',
      category: 'music',
      description: 'command_play_description',
      usage: 'play [title song | url youtube]',
      nsfw: false,
      enable: true,
      guildOnly: true,
      aliases: ['p'],
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
   * @param {Array<String>} query - argument
   * @param {Object} options - options
   * @param {Object} options.guild - guild data
   * @return {Promise<Message>}
   */
  async launch(message, query, {guild}) {
    this.initQueue(this.client.music, message.guild.id);
    if (!message.guild.me.voice.channel) {
      if (!message.member.voice.channel) {
        return message.channel.send(
            language(guild.lg, 'command_music_userNoJoin'),
        );
      };
      if (this.hasPermission(message)) {
        this.client.music[message.guild.id].connection =
          await message.member.voice.channel.join();
      } else {
        return message.reply(
            language(guild.lg, 'command_music_noPermissions'),
        );
      };
    } else {
      if (!this.client.music[message.guild.id].connection) {
        this.client.music[message.guild.id].connection =
          await message.member.voice.channel.join();
      };
    };
    if (!query.join(' ')) return this.play(message, guild);
    const youtube = await this.getSong(query);
    if (youtube.error) return message.channel.send(youtube.error.message);
    if (youtube.isAxiosError) {
      return message.channel.send(`ERROR: code http ${youtube.status}`);
    };
    // eslint-disable-next-line guard-for-in
    for (const key in youtube.items) {
      youtube.items[key].snippet.title =
        htmlEntitiesDecoder(youtube.items[key].snippet.title);
    };
    const content = {embed: {
      title: language(guild.lg, 'command_music_listMusic'),
      color: '#2F3136',
      description: `${youtube.items.map((v, i) =>
        `[${i+1}] ${v.snippet.title}`).join('\n')}`,
      timestamp: Date.now(),
      footer: {
        text: language(guild.lg, 'command_music_choiceFooter'),
        icon_url: this.client.user
            .displayAvatarURL({format: 'webp', dynamic: true, size: 2048}),
      },
    }};
    message.channel.send(content).then((msg) => {
      const filter = (msg) => msg.author.id === message.author.id;
      const collector = new MessageCollector(message.channel, filter, {
        time: 20000,
      });
      collector.on('collect', async (msgCollected) => {
        const choice = msgCollected.content.trim().split()[0];
        if (choice.toLowerCase() === 'cancel') {
          return collector.stop('STOPPED');
        };
        if (!choice || isNaN(choice)) {
          return message.channel.send(
              language(guild.lg, 'command_music_choiceInvalid'),
          );
        };
        if (choice > youtube.items.length || choice <= 0) {
          return message.reply(
              language(guild.lg, 'command_music_choiceNotFound'),
          );
        };
        const song = youtube.items[choice - 1];
        collector.stop('PLAY');
        msg.delete();
        msgCollected.delete();
        const info = await ytdl.getBasicInfo(`https://www.youtube.com/watch?v=${song.id.videoId}`);
        song.time = JSON.parse(JSON.stringify(info)).length_seconds*1000;
        song.request = message.member;
        if (!guild.player_history) guild.player_history = [];
        guild.player_history.push(song);
        this.client.music[message.guild.id].type = 'player';
        guild = await this.updateQueue(guild.player_history, message);
        if (guild.player_history.length > 1) {
          message.channel.send({embed: {
            color: '#2F3136',
            title: 'Ajout à la playlist',
            description: song.snippet.title,
            thumbnail: {
              url: song.snippet.thumbnails.high.url,
            },
          },
          });
          if (!this.client.music[message.guild.id].dispatcher) {
            this.play(message);
          }
        } else {
          if (guild.player_history <= 1) {
            this.client.music[message.guild.id].index = 0;
          };
          this.play(message, guild);
        };
      });
      collector.on('end', (collected, reason) => {
        if (reason === 'STOPPED') {
          return message.reply(language(guild.lg, 'command_music_choiceStop'));
        } else if (reason === 'PLAY') {
          return false;
        } else {
          return message.reply(language(guild.lg, 'command_music_timeout'));
        };
      });
    });
  };
  /**
   * play song
   * @param {Message} message - message
   * @param {Object} guild - guild data
   * @return {*}
   */
  async play(message, guild) {
    guild = await this.client.getGuild(message.guild);
    if (!guild.player_history || guild.player_history.length < 1) {
      return message.channel.send(
          language(guild.lg, 'command_music_notQueue'),
      );
    };
    this.client.music[message.guild.id].dispatcher =
    this.client.music[message.guild.id].connection.play(
        await ytdl(`https://www.youtube.com/watch?v=${guild.player_history[this.client.music[message.guild.id].index].id.videoId}`, {
          filter: 'audioonly',
          highWaterMark: 20,
          quality: 'highestaudio',
        }, {
          volume: guild.player_volume/100,
          fec: true,
          bitrate: 96,
          highWaterMark: 20,
          seek: 0,
        }),
    );
    this.client.music[message.guild.id].connection.voice.setSelfDeaf(true);
    this.client.music[message.guild.id].connection.voice.setSelfMute(false);
    this.client.music[message.guild.id].broadcast = false;
    if (!guild.player_muteIndicator) {
      message.channel.send({
        embed: {
          color: '#2F3136',
          title: language(guild.lg, 'commande_music_played'),
          description: guild.player_history[
              this.client.music[message.guild.id].index].snippet.title,
          thumbnail: {
            url: guild.player_history[
                this.client.music[
                    message.guild.id].index].snippet.thumbnails.default.url,
          },
        },
      });
    } else {
      message.react('👌');
    };
    this.client.music[message.guild.id]
        .dispatcher.on('finish', async () => {
          guild = await this.client.getGuild(message.guild);
          this.client.music[message.guild.id].dispatcher = null;
          if (guild.player_loop === 'off' &&
  guild.player_history.length !== 0) {
            guild.player_history.shift();
            guild = await this.updateQueue(guild.player_history, message);
            if (guild.player_history.length === 0) {
              return message.channel.send(
                  language(guild.lg, 'command_music_finish'),
              );
            };
            this.client.music[message.guild.id].index = 0;
            this.play(message, guild);
          } else if (guild.player_loop === 'on') {
            if (this.client.music[message.guild.id].index ===
    guild.player_history.length - 1) {
              this.client.music[message.guild.id].index = 0;
            } else {
              this.client.music[message.guild.id].index++;
            };
            this.play(message, guild);
          } else if (guild.player_loop === 'once') {
            this.play(message, guild);
            this.client.music[message.guild.id].index =
              this.client.music[message.guild.id].index;
          };
        });
    let r;
    this.client.music[message.guild.id].dispatcher.on('speaking', (s) => {
      if (s === r) return;
      r=s;
      this.client.music[message.guild.id].isPlaying = s;
    });
    this.client.music[message.guild.id].dispatcher.on('error',
        async (err) => {
          console.error(err);
          guild = await this.client.getGuild(message.guild);
          this.play(message, guild);
          return message.channel.send(err, {code: 'js'});
        });
  };
  /**
   * Add song in Queue
   * @param {Object} queue - player
   * @param {Message} message - message
   * @return {Promise<Object>}
   */
  async updateQueue(queue, message) {
    await this.client.updateGuild(message.guild, {
      player_history: queue,
    });
    return await this.client.getGuild(message.guild);
  };
  /**
   * Get data of song
   * @param {Array<String>} query - query
   * @return {Promise<Object>}
   */
  async getSong(query) {
    return await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&key=${YOUTUBE_KEY}&q=${encodeURI(query.join(' '))}`).then((response) => response.data).catch((error) => error);
  };
  /**
   * Initialise queue
   * @param {Object} queue - Global queue
   * @param {Number} guildID - guild id
   * @return {Object}
   */
  initQueue(queue, guildID) {
    if (!queue[guildID]) {
      return queue[guildID] = {
        connection: null,
        dispatcher: null,
        index: 0,
        broadcast: false,
        type: 'player',
      };
    } else {
      return queue[guildID];
    };
  };
  /**
   * Check if user has permissions to execute music command
   * @param {Message} message
   * @return {boolean}
   */
  hasPermission(message) {
    if (!message.guild.me.voice.channel) return true;
    if (message.member.hasPermission(['ADMINISTRATOR'],
        {checkAdmin: true, checkOwner: true})) return true;
    if (message.member.roles.cache.some((r) => r.name === 'dj')) return true;
    if (message.guild.me.voice.channel.members.size <= 2) return true;
    return false;
  }
};

module.exports = Play;
