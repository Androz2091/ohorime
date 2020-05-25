'use strict';

const Command = require('../../plugin/Command');
const moment = require('moment');

/**
 * Channel command
 */
class Channel extends Command {
  /**
   * @param {Client} client - Client
   */
  constructor(client) {
    super(client, {
      name: 'channel',
      category: 'util',
      description: 'command_channel_description',
      usage: 'channel (channel mention)',
      nsfw: false,
      enable: true,
      guildOnly: false,
      aliases: ['infochannel', 'channelinfo'],
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
     * Check if it's a query
     */
    if (query.join(' ')) {
      /**
       * Get channel
       */
      const channel = message.mentions.channels.first() ||
      message.guild.channels.cache.find((channel) =>
        channel.name === query.join('')) ||
      message.guild.channels.cache.find((channel) =>
        channel.id === query.join('')) ||
      message.guild.channels.cache.find((channel) =>
        channel.position === query.join('')) ||
      this.client.channels.cache.find((channel) =>
        channel.name === query.join('')) ||
        this.client.channels.cache.find((channel) =>
          channel.id === query.join('')) ||
        this.client.channels.cache.find((channel) =>
          channel.position === query.join(''));
      /**
       * Check if channel is null or undefined
       */
      if (!channel) {
        return message.channel.send('Aucun émoji trouvé');
      };
      /**
       * Create embed
       */
      const embed = {
        title: channel.name + ' - ' + channel.type,
        color: guild.color,
        fields: [
          {
            name: 'created at',
            value: moment(channel.createdTimestamp).format('L'),
            inline: true,
          },
          {
            name: 'channel',
            value: channel.toString(),
            inline: true,
          },
          {
            name: 'ID',
            value: channel.id,
            inline: true,
          },
          {
            name: 'guild',
            value: channel.guild.name,
            inline: true,
          },
          {
            name: 'parent',
            value: channel.parent ?
              channel.parent.toString() :
              'No parent',
            inline: true,
          },
          {
            name: 'position',
            value: channel.position,
            inline: true,
          },
        ],
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
      for (let key of message.guild.channels.cache) {
        key = key[1];
        if (!packet[index]) {
          packet[index] = [];
          packet[index].push(key.toString());
        } else {
          if ((packet[index].join(', ').length + key
              .toString().length) > 1024) {
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
          name: `channel liste ${indexage}`,
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

module.exports = Channel;
