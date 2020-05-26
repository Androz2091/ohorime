'use strict';
const Command = require('../../plugin/Command');
const language = require('../../i18n');

/**
 * Favorite command
 */
class Favorite extends Command {
  /**
   * @param {Client} client - Client
   */
  constructor(client) {
    super(client, {
      name: 'favorite',
      category: 'music',
      description: 'command_favorite_description',
      usage: 'favorite',
      nsfw: false,
      enable: true,
      guildOnly: true,
      aliases: ['fav'],
      mePerm: [
        'CONNECT',
        'SPEAK',
        'EMBED_LINKS',
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
  async launch(message, query, {guild, user}) {
    const player = new (require('./play'))(this.client);
    await player.initQueue(this.client.music, message.guild.id);
    switch (query.shift()) {
      case 'save':
        const msgLoad =
          await message.channel.send(
              language(guild.lg, 'command_favorite_saving')
                  .replace(/{{emote}}+/g,
                      this.client.config.emote.loading.id));
        if (guild.player_history < 1) {
          msgLoad.edit(`failed ${
            this.client.config.emote.no.id
          }`);
          return message.channel.send(
              language(guild.lg, 'command_favorite_noPlaylist'),
          );
        };
        if (!query.join(' ')) {
          msgLoad.edit(`failed ${
            this.client.config.emote.no.id
          }`);
          // eslint-disable-next-line max-len
          return message.channel.send(
              language(guild.lg, 'command_favorite_enterName')
                  .replace(/{{prefix}}+/g, guild.prefix),
          );
        };
        if (!user.musicFavorite) user.musicFavorite = {};
        if (!user.musicFavorite[query.join(' ')]) {
          user.musicFavorite[query.join(' ')] = guild.player_history;
          await this.client.updateUser(message.author, {
            musicFavorite: user.musicFavorite,
          });
          user = await this.client.getUser(message.author);
          message.channel.send({
            embed: {
              color: '#2F3136',
              title: language(guild.lg, 'command_favorite_save_embed_title'),
              description: 'arguments: `save`, `play`, `vue`, `delete`\n\n'+
               `${Object.keys(user.musicFavorite).map((v, i) =>
                 `[${i+1}] ${v}`).join('\n')}`,
            },
          });
          msgLoad.edit(
              language(guild.lg, 'command_favorite_successful')
                  .replace(/{{emote}}+/g, this.client.config.emote.yes.id),
          );
        } else {
          msgLoad.edit(
              language(guild.lg, 'command_favorite_failed')
                  .replace(/{{emote}}+/g, this.client.config.emote.no.id),
          );
          return message.channel.send(
              language(guild.lg, 'command_favorite_nameUsed'));
        }
        break;
      case 'vue':
        const index = query.shift();
        if (!index) {
          return message.channel.send(
              language(guild.lg, 'command_favorite_selectNumber'),
          );
        };
        if (!user.musicFavorite) user.musicFavorite = {};
        if (!Object.keys(user.musicFavorite)[index-1]) {
          return message.channel.send(
              language(guild.lg, 'command_favorite_selectValidNumber'),
          );
        };
        return message.channel.send({
          embed: {
            color: '#2F3136',
            title: `${Object.keys(user.musicFavorite)[index-1]} playlist`,
            description: `${
              user.musicFavorite[Object.keys(user.musicFavorite)[index-1]]
                  .map((v, i) =>
                    `[${i+1}] ${v.snippet.title}`).join('\n')}`,
          },
        });
        break;
      case 'delete':
        if (!query.join('')) {
          return message.channel.send(
              language(guild.lg, 'command_favorite_selectNumber'),
          );
        };
        if (!user.musicFavorite) user.musicFavorite = {};
        if (!Object.keys(user.musicFavorite)[query.join('')-1]) {
          return message.channel.send(
              language(guild.lg, 'command_favorite_selectValidNumber'),
          );
        };
        delete user.musicFavorite[
            Object.keys(user.musicFavorite)[query.join('')-1]];
        await this.client.updateUser(message.author, {
          musicFavorite: user.musicFavorite,
        });
        user = await this.client.getUser(message.author);
        message.channel.send({
          embed: {
            color: '#2F3136',
            title: language(guild.lg, 'command_favorite_save_embed_title'),
            description: 'arguments: `save`, `play`, `vue`, `delete`\n\n'+
               `${Object.keys(user.musicFavorite).map((v, i) =>
                 `[${i+1}] ${v}`).join('\n')}`,
          },
        });
        break;
      case 'play':
        if (!query.join('')) {
          return message.channel.send(
              language(guild.lg, 'command_favorite_selectNumber'),
          );
        };
        if (!user.musicFavorite) user.musicFavorite = {};
        if (!Object.keys(user.musicFavorite)[query.join('')-1]) {
          return message.channel.send(
              language(guild.lg, 'command_favorite_selectValidNumber'),
          );
        };
        // eslint-disable-next-line max-len
        user = await player.updateQueue(user.musicFavorite[Object.keys(user.musicFavorite)[query.join('')-1]], message);
        this.client.music[message.guild.id].index = 0;
        if (player.hasPermission(message)) {
          if (!client.music[message.guild.id].connection) {
            client.music[message.guild.id].connection =
              await message.member.voice.channel.join();
          };
        };
        player.play(message, guild);
        break;
      default:
        if (!user.musicFavorite || Object.keys(user.musicFavorite) < 1) {
          message.channel.send({
            embed: {
              color: '#2F3136',
              title: language(guild.lg, 'command_favorite_noFavorite'),
              description: 'arguments: `save`, `play`, `vue`, `delete`',
            },
          });
        } else {
          message.channel.send({
            embed: {
              color: '#2F3136',
              title: language(guild.lg, 'command_favorite_default_embed_title'),
              description: 'arguments: `save`, `play`, `vue`, `delete`\n\n'+
               `${Object.keys(user.musicFavorite).map((v, i) =>
                 `[${i+1}] ${v}`).join('\n')}`,
            },
          });
        };
        break;
    }
  };
};

module.exports = Favorite;
