'use strict';
const Command = require('../../plugin/Command');

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
          await message.channel.send(`saving ${
            this.client.config.emote.loading.id}`);
        if (guild.player.history < 1) {
          msgLoad.edit(`failed ${
            this.client.config.emote.no.id
          }`);
          return message.channel.send('This playlist is empty');
        };
        if (!query.join(' ')) {
          msgLoad.edit(`failed ${
            this.client.config.emote.no.id
          }`);
          // eslint-disable-next-line max-len
          return message.channel.send(`Please enter name, example: \`${guild.prefix}favorite save myPlaylist\``);
        };
        if (!user.musicFavorite) user.musicFavorite = {};
        if (!user.musicFavorite[query.join(' ')]) {
          user.musicFavorite[query.join(' ')] = guild.player.history;
          await this.client.updateUser(message.author, {
            musicFavorite: user.musicFavorite,
          });
          user = await this.client.getUser(message.author);
          message.channel.send({
            embed: {
              color: '#2F3136',
              title: 'your favorite list',
              description: 'arguments: `save`, `play`, `vue`, `delete`\n\n'+
               `${Object.keys(user.musicFavorite).map((v, i) =>
                 `[${i+1}] ${v}`).join('\n')}`,
            },
          });
          msgLoad.edit(`successful ${
            this.client.config.emote.yes.id
          }`);
        } else {
          msgLoad.edit(`failed ${
            this.client.config.emote.no.id
          }`);
          return message.channel.send('The name is already in use');
        }
        break;
      case 'vue':
        const index = query.shift();
        if (!index) {
          return message.channel.send('Please select a number');
        };
        if (!guild.player.favorite) guild.player.favorite = {};
        if (!Object.keys(guild.player.favorite)[index-1]) {
          return message.channel.send('Please select a valid number');
        };
        return message.channel.send({
          embed: {
            color: '#2F3136',
            title: `${Object.keys(guild.player.favorite)[index-1]} playlist`,
            description: `${
              guild.player.favorite[Object.keys(guild.player.favorite)[index-1]]
                  .map((v, i) =>
                    `[${i+1}] ${v.snippet.title}`).join('\n')}`,
          },
        });
        break;
      case 'delete':
        if (!query.join('')) {
          return message.channel.send('Please select a number');
        };
        if (!guild.player.favorite) guild.player.favorite = {};
        if (!Object.keys(guild.player.favorite)[query.join('')-1]) {
          return message.channel.send('Please select a valid number');
        };
        delete guild.player.favorite[
            Object.keys(guild.player.favorite)[query.join('')-1]];
        await this.client.updateUser(message.author, {
          player: guild.player.guild.player.favorite,
        });
        user = await this.client.getUser(message.author);
        message.channel.send({
          embed: {
            color: '#2F3136',
            title: 'your favorite list',
            description: 'arguments: `save`, `play`, `vue`, `delete`\n\n'+
               `${Object.keys(guild.player.favorite).map((v, i) =>
                 `[${i+1}] ${v}`).join('\n')}`,
          },
        });
        break;
      case 'play':
        if (!query.join('')) {
          return message.channel.send('Please select a number');
        };
        if (!guild.player.favorite) guild.player.favorite = {};
        if (!Object.keys(guild.player.favorite)[query.join('')-1]) {
          return message.channel.send('Please select a valid number');
        };
        // eslint-disable-next-line max-len
        guild = await player.updateQueue(guild.player.favorite[Object.keys(guild.player.favorite)[query.join('')-1]], message);
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
        if (!guild.player.favorite || Object.keys(guild.player.favorite) < 1) {
          message.channel.send({
            embed: {
              color: '#2F3136',
              title: 'no favorites',
              description: 'arguments: `save`, `play`, `vue`, `delete`',
            },
          });
        } else {
          message.channel.send({
            embed: {
              color: '#2F3136',
              title: 'your favorite list',
              description: 'arguments: `save`, `play`, `vue`, `delete`\n\n'+
               `${Object.keys(guild.player.favorite).map((v, i) =>
                 `[${i+1}] ${v}`).join('\n')}`,
            },
          });
        };
        break;
    }
  };
};

module.exports = Favorite;
