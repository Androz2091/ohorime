'use strict';
const Command = require('../../plugin/Command');
const moment = require('moment');

/**
 * User command
 */
class User extends Command {
  /**
   * @param {Client} client - Client
   */
  constructor(client) {
    super(client, {
      name: 'user',
      category: 'util',
      description: 'command_user_description',
      usage: 'user',
      nsfw: false,
      enable: true,
      guildOnly: false,
      aliases: ['infousre', 'usreinfo'],
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
    if (query.join(' ')) {
      /**
       * Get user
       */
      let user = message.mentions.users.first() ||
      this.client.users.cache.find((user) =>
        user.username.toLowerCase().trim() === query.join('')) ||
      this.client.users.cache.find((user) =>
        user.tag.toLowerCase().trim() === query.join('')) ||
      this.client.users.cache.find((user) =>
        user.id === query.join(''));
      /**
       * Check if there is User
       */
      if (user && user.user) {
        user = user.user;
      };
      /**
       * Get member
       */
      const member = message.mentions.members.first() ||
        message.guild.member(
            message.mentions.users.first(),
        ) ||
        message.guild.members.cache.find((member) =>
          member.id === query.join('')) ||
        message.guild.members.cache.find((member) =>
          member.displayName.toLowerCase().trim() ===
            query.join('').toLowerCase().trim()) ||
        message.guild.members.cache.find((member) =>
          member.user.username.toLowerCase().trim() ===
            query.join('').toLowerCase().trim()) ||
        message.guild.members.cache.find((member) =>
          member.toString() === query.join(''));
      /**
       * If there is not User [user], set user with GuildMember [member]
       */
      if (member && !user) {
        user = member.user;
      };
      /**
       * Check if there is user
       */
      if (!user) {
        return message.channel.send('Aucun utilisateur trouvé');
      };
      /**
       * Create embed
       */
      const embed = {
        title: user.username + ' - ' + user.discriminator,
        thumbnail: {},
        image: {},
        fields: [
          {
            name: 'created at',
            value: moment(user.createdTimestamp).format('L'),
            inline: true,
          },
          {
            name: 'user',
            value: user.toString(),
            inline: true,
          },
          {
            name: 'ID',
            value: user.id,
            inline: true,
          },
          {
            name: 'bot',
            value: user.bot,
            inline: true,
          },
          {
            name: 'tag',
            value: user.tag,
            inline: true,
          },
        ],
      };
      /**
       * Check if there is member
       */
      if (member) {
        /**
         * Set embed color
         */
        embed.color = member.displayHexColor;
        /**
         * Push display name in embed fields
         */
        embed.fields.push({
          name: 'display name',
          value: member.displayName,
          inline: true,
        });
        /**
         * Push joined at in embed fields
         */
        embed.fields.push({
          name: 'joined at',
          value: moment(member.joinedTimestamp).format('L'),
          inline: true,
        });
        /**
         * Check if there is  premium since timestamp
         */
        if (member.premiumSinceTimestamp) {
        /**
         * Push premium since in embed fields
         */
          embed.fields.push({
            name: 'premium since',
            value: moment(member.premiumSinceTimestamp).format('L'),
            inline: true,
          });
        };
      } else {
        /**
         * Set embed color
         */
        embed.color = guild.color;
      };

      /**
       * Check if activites > 0
       */
      if (user.presence.activities.length > 0) {
        /**
         * Get activity
         */
        const [activity] = user.presence.activities;
        /**
         * If activity is Spotify
         */
        if (activity.name === 'Spotify' && activity.type === 'LISTENING') {
          /**
           * Push activity Spotify in embed fields
           */
          embed.fields.push({
            name: 'activity Spotify',
            // eslint-disable-next-line max-len
            value: `[${activity.details} by ${activity.state} on ${activity.assets.largeText}](${activity.assets.largeImage})`,
          });
        } else {
          /**
           * Push activity to in embed fields
           */
          embed.fields.push({
            name: 'activity',
            value: `name: ${activity.name} | ${activity.details}`,
          });
        };
        /**
         * Check if there is assets
         */
        if (activity.assets && activity.assets.largeImage) {
          /**
           * Set embed image
           */
          embed.image.url = activity.assets.largeImage;
        };
        /**
         * Check if there is url
         */
        if (activity.url) {
          /**
           * Set embed url
           */
          embed.url = activity.url;
        }
      };
      /**
       * check if there is avatar
       */
      if (user.displayAvatarURL()) {
        /**
         * Set embed thumbnail
         */
        embed.thumbnail.url = user.displayAvatarURL();
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
      for (let key of message.guild.members.cache) {
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
          name: `user liste ${indexage}`,
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

module.exports = User;
