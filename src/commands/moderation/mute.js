'use strict';
const Command = require('../../plugin/Command');

/**
 * Command class
 */
class Mute extends Command {
  /**
   * @param {Client} client - Client
   */
  constructor(client) {
    super(client, {
      name: 'mute',
      category: 'moderation',
      description: 'command_mute_description',
      usage: 'mute',
      nsfw: false,
      enable: true,
      guildOnly: true,
      aliases: [],
      mePerm: ['MANAGE_MESSAGES', 'READ_MESSAGE_HISTORY'],
      userPerm: ['MANAGE_MESSAGES'],
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
    if (!guild.muteRole && query[0] !== 'config') {
      return message.channel.send({
        embed: {
          title: 'Mute command',
          // eslint-disable-next-line max-len
          description: `No mute role configured please use this command\n\`${guild.prefix}mute config create muteRole\``,
        }});
    };
    switch (query.shift()) {
      case 'config':
        switch (query.shift()) {
          case 'create':
            switch (query.shift()) {
              case 'roleMute':
                const muteRole = await message.guild.roles.create({
                  data: {
                    name: 'mute',
                    color: '#000000',
                    permissions: 0,
                  },
                  reason: `Mute role created by ${this.client.user.tag}`,
                });
                if (muteRole) {
                  await this.client.updateGuild(message.guild, {
                    muteRole: muteRole.id,
                  });
                  message.channel.send('Role created successfully');
                  muteRole.setPosition(message.guild.me.roles.highest - 1);
                } else {
                  return message.channel.send('Role not created');
                }
                break;
              default:
                message.channel.send({
                  embed: {
                    title: 'Mute command',
                    // eslint-disable-next-line max-len
                    description: `commands:\n\`${guild.prefix}mute config create roleMute\``,
                  },
                });
                break;
            };
            break;
          default:
            message.channel.send({
              embed: {
                title: 'Mute command',
                // eslint-disable-next-line max-len
                description: `commands:\n**${guild.prefix}mute config create**\n\`${guild.prefix}mute config create roleMute\`\n**${guild.prefix}mute config set**\n\`${guild.prefix}mute config set role\`\n\`${guild.prefix}mute config set defaultDelay\`\n\`${guild.prefix}mute config set muteChannelExeption\`\n\`${guild.prefix}mute config set muteChannelView\`\n\`${guild.prefix}mute config set muteAffectVocal\``,
              },
            });
            break;
        }
        break;

      default:
        message.channel.send({
          embed: {
            title: 'Mute command',
            // eslint-disable-next-line max-len
            description: `**${guild.prefix}mute config**\n**${guild.prefix}mute <mention> <delay: 1h>**`,
          }});
        break;
    }
  };
};

module.exports = Mute;
