'use strict';
const Command = require('../../plugin/Command');
const language = require('../../i18n');

/**
 * Command class
 */
class Purge extends Command {
  /**
   * @param {Client} client - Client
   */
  constructor(client) {
    super(client, {
      name: 'purge',
      category: 'moderation',
      description: 'command_purge_description',
      usage: 'purge [number]',
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
  launch(message, query, {guild}) {
    return message.channel.bulkDelete(Number(query.join('')) + 1, true)
        .then((messages) => {
          return message.reply(
              language(guild.lg, 'command_purge_success',
              )
                  .replace('{{size}}', messages.size))
              .then((msg) => msg.delete({timeout: 3000}));
        }).catch((err) => {
          console.error(err);
          message.channel.send(language(guild.lg, 'command_purge_error'));
          return message.channel.send(err, {code: 'js'});
        });
  };
};

module.exports = Purge;
