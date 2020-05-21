'use strict';
const Command = require('../../plugin/Command');
const moment = require('moment');

/**
 * Command emote
 */
class Emote extends Command {
  /**
   * @param {Client} client - Client
   */
  constructor(client) {
    super(client, {
      name: 'emote',
      category: 'util',
      description: 'command_emote_description',
      usage: 'emote (:role:)',
      nsfw: false,
      enable: true,
      guildOnly: false,
      aliases: ['infoemote', 'emoteinfo', 'infoemoji',
        'emojiinfo', 'emote', 'emoji'],
      mePerm: ['EMBED_LINKS'],
    });
    this.client = client;
  };
  /**
   * @param {Message} message - message
   * @param {Array<String>} query - query
   * @param {Object} options - options
   * @param {Object} options.guild - guild data
   * @return {Promise<Message>}
   */
  async launch(message, query, {guild}) {
    /**
     * Check if it's query
     */
    if (query.join('')) {
      /**
       * Get emote
       */
      const emote = this.client.emojis.cache.find((emoji) =>
        emoji.name === query.join('')) ||
        this.client.emojis.cache.find((emoji) =>
          emoji.id === query.join('')) ||
        this.client.emojis.cache.find((emoji) =>
          emoji.url === query.join('')) ||
        this.client.emojis.cache.find((emoji) =>
          emoji.toString() === query.join(''));
      /**
       * Check if emote is undefined or null
       */
      if (!emote) {
        return message.channel.send('Aucun émoji trouvé');
      };
      /**
       * Create embed
       */
      const embed = {
        title: emote.name,
        color: guild.color,
        description: (emote.url ?
        `[emote url](${emote.url})` :
        'No URL'),
        fields: [
          {
            name: 'animated',
            value: emote.animated,
            inline: true,
          },
          {
            name: 'created at',
            value: moment(emote.createdTimestamp).format('L'),
            inline: true,
          },
          {
            name: 'user upload',
            value: await emote.fetchAuthor() ?
            await emote.fetchAuthor() :
            'Aucun utilisateur',
            inline: true,
          },
          {
            name: 'emote',
            value: emote.toString(),
            inline: true,
          },
          {
            name: 'guild',
            value: emote.guild.name,
            inline: true,
          },
          {
            name: 'ID',
            value: emote.id,
            inline: true,
          },
        ],
        thumbnail: {},
      };
      /**
       * Check if there is url
       */
      if (emote.url) {
        embed.thumbnail.url = emote.url;
      };
      /**
       * Send message
       */
      return message.channel.send({embed});
    } else {
      /**
       * Init packet
       */
      const packet = {};
      let index = 0;
      /**
       * Push packet
       */
      for (let key of message.guild.emojis.cache) {
        key = key[1];
        if (!packet[index]) {
          packet[index] = [];
          packet[index].push(key.toString());
        } else {
          if ((packet[index].join(' ').length + key.toString().length) > 1024) {
            index = index + 1;
            packet[index] = [];
            packet[index].push(key.toString());
          } else {
            packet[index].push(key.toString());
          }
        };
      };
      /**
       * Create embed
       */
      const embed = {
        color: '#2F3136',
        fields: [],
      };
      /**
       * Push embed
       */
      let indexage = 1;
      // eslint-disable-next-line guard-for-in
      for (const key in packet) {
        embed.fields.push({
          name: `émotes liste ${indexage}`,
          value: packet[key].join(' '),
          inline: true,
        });
        indexage = indexage + 1;
      };
      /**
       * Send message
       */
      return message.channel.send({embed});
    }
  };
};

module.exports = Emote;
