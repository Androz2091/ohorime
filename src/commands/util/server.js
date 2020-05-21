'use strict';
const Command = require('../../plugin/Command');

/**
 * Server command
 */
class Server extends Command {
  /**
   * @param {Client} client - Client
   */
  constructor(client) {
    super(client, {
      name: 'server',
      category: 'util',
      description: 'command_server_description',
      usage: 'server',
      nsfw: false,
      enable: true,
      guildOnly: false,
      aliases: ['serverinfo', 'infoserver', 'serverinfo', 'servinfo', 'serv'],
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
     * Fetch invite
     */
    const [invite] = await message.guild.fetchInvites();
    /**
     * Create embed
     */
    const embed = {
      title: message.guild.name + ' - ID: ' + message.guild.id,
      color: guild.color,
      description: (invite ?
        `[invite](https://discord.gg/${invite[0]})` :
        `Aucune invitation`) +
        '\n' +
        (message.guild.description === null ?
        `Aucune description` :
        message.guild.description),
      thumbnail: {},
      fields: [
        {
          name: 'afk channel',
          value: message.guild.afkChannel ?
            message.guild.afkChannel :
            'No channel',
          inline: true,
        },
        {
          name: 'afk timeout',
          value: message.guild.afkTimeout ?
            message.guild.afkTimeout :
            'No afk timeout',
          inline: true,
        },
        {
          name: 'available',
          value: message.guild.available,
          inline: true,
        },
        {
          name: 'created at',
          value: message.guild.createdAt ?
            message.guild.createdAt :
            'No created at',
          inline: true,
        },
        {
          name: 'explicit content filter',
          value: message.guild.explicitContentFilter,
          inline: true,
        },
        {
          name: 'large',
          value: message.guild.large,
          inline: true,
        },
        {
          name: 'member count',
          value: message.guild.memberCount,
          inline: true,
        },
        {
          name: 'mfa level',
          value: message.guild.mfaLevel,
          inline: true,
        },
        {
          name: 'owner',
          value: message.guild.members.cache.find((m) =>
            m.id === message.guild.ownerID),
          inline: true,
        },
        {
          name: 'partnered',
          value: message.guild.partnered ?
            message.guild.partnered :
            'No partnered',
          inline: true,
        },
        {
          name: 'premium subscription count',
          value: message.guild.premiumSubscriptionCount ?
            message.guild.premiumSubscriptionCount :
            'No premium subscription count',
          inline: true,
        },
        {
          name: 'premium tier',
          value: message.guild.premiumTier,
          inline: true,
        },
        {
          name: 'shard',
          // eslint-disable-next-line max-len
          value: `websocket - id: [${message.guild.shard.id}] ping: [${message.guild.shard.ping}] status: [${message.guild.shard.status}]`,
          inline: true,
        },
        {
          name: 'verified',
          value: message.guild.verified ?
            message.guild.verified :
            'No verified',
          inline: true,
        },
      ],
    };
    /**
     * Check if there is icon url
     */
    if (message.guild.iconURL()) {
      embed.thumbnail.url = message.guild.iconURL();
    };
    /**
     * Send message
     */
    return message.channel.send({embed});
  };
};

module.exports = Server;
