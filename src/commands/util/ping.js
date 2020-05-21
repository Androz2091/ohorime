'use strict';
const Command = require('../../plugin/Command');

/**
 * Ping Command
 */
class Ping extends Command {
  /**
   * @param {Client} client - Client
   */
  constructor(client) {
    super(client, {
      name: 'ping',
      category: 'util',
      description: 'command_ping_description',
      usage: 'ping',
      nsfw: false,
      enable: true,
      guildOnly: false,
      aliases: ['pg'],
    });
    this.client = client;
  };
  /**
   * @param {Message} message - message
   * @return {Promise<Message>}
   */
  async launch(message) {
    /**
     * Start time process
     */
    const processTime = Date.now();
    /**
     * Send message
     */
    const pingMessage = await message.channel.send(`Pinging ${
      this.client.config.emote.loading.id}`);
    /**
     * Send message
     */
    return pingMessage.edit(
        `🏓 Pong !\n> Client latency: **${
          this.client.ws.ping
        } ms**\n> API latency: **${
          pingMessage.createdTimestamp - message.createdTimestamp
        } ms**\n> Speed of the bot to complete a task : **${
          Date.now() - processTime
        } ms**`)
        .catch(console.error);
  };
};

module.exports = Ping;
