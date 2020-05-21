'use strict';
const Command = require('../../plugin/Command');
const moment = require('moment');

/**
 * Role command
 */
class Role extends Command {
  /**
   * @param {Client} client - Client
   */
  constructor(client) {
    super(client, {
      name: 'role',
      category: 'util',
      description: 'command_role_description',
      usage: 'role',
      nsfw: false,
      enable: true,
      guildOnly: false,
      aliases: ['inforole', 'roleinfo'],
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
       * Get role
       */
      const role = message.mentions.roles.first() ||
        message.guild.roles.find((role) =>
          role.name.toLowerCase().trim() ===
            query.join('').toLocaleLowerCase().trim()) ||
        message.guild.roles.cache.find((role) =>
          role.id === query.join('')) ||
        message.guild.roles.cache.find((role) =>
          role.position === query.join(''));
      /**
       * Create embed
       */
      const embed = {
        title: role.name,
        color: role.hexColor,
        fields: [
          {
            name: 'created at',
            value: moment(role.createdAt).format('L'),
            inline: true,
          },
          {
            name: 'hoist',
            value: role.hoist,
            inline: true,
          },
          {
            name: 'ID',
            value: role.id,
            inline: true,
          },
          {
            name: 'position',
            value: role.position,
            inline: true,
          },
          {
            name: 'mentionable',
            value: role.mentionable,
            inline: true,
          },
          {
            name: 'administrator',
            value: role.permissions.has(['ADMINISTRATOR']),
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
      for (let key of message.guild.roles.cache) {
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
          name: `roles liste ${indexage}`,
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

module.exports = Role;
