'use strict';
const Command = require('../../plugin/Command');

/**
 * Command class
 */
class Destroy extends Command {
  /**
   * @param {Client} client - Client
   */
  constructor(client) {
    super(client, {
      name: 'destroy',
      category: 'music',
      description: 'command_destroy_description',
      usage: 'destroy',
      nsfw: false,
      enable: true,
      guildOnly: true,
      aliases: ['stop'],
      mePerm: [
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
  async launch(message, query, {guild}) {
    if (!this.client.music[message.guild.id]) {
      return message.channel.send(`Aucune musique est initié`);
    };
    if (!this.client.music[message.guild.id].dispatcher) {
      return message.channel.send('Je ne joue pas de musique');
    };
    const player = new (require('./play'))(this.client);
    if (!player.hasPermission(message)) {
      return message.channel.send('You do not have permission');
    };
    await this.client.music[message.guild.id].dispatcher.destroy();
    this.client.music[message.guild.id].dispatcher = null;
  };
};

module.exports = Destroy;
