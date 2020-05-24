'use strict';
const Command = require('../../plugin/Command');
const language = require('../../translate');
const {sfw} = new (require('nekos.life'))();
const {MessageAttachment} = require('discord.js');

/**
 * Command class
 */
class EightBall extends Command {
  /**
   * @param {Client} client - Client
   */
  constructor(client) {
    super(client, {
      name: '8ball',
      category: 'fun',
      description: 'command_8ball_description',
      usage: '8ball [question]',
      nsfw: false,
      enable: true,
      guildOnly: false,
      aliases: ['EightBall'],
    });
    this.client = client;
  };
  /**
   * @param {Message} message - message
   * @param {Array} query - query
   * @param {Object} options - options
   * @param {Object} options.guild - guild data
   */
  async launch(message, query, {guild}) {
    if (!query.join(' ')) {
      return message.reply(language(guild.lg, 'value_not_found'));
    };
    // eslint-disable-next-line new-cap
    const data = await sfw['8Ball']({
      text: query.join(' '),
    });
    const attachment = new MessageAttachment(data.url);
    return message.channel.send({
      content: data.response,
      files: [attachment],
    })
        .catch(console.error);
  };
};

module.exports = EightBall;
