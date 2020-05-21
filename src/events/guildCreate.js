'use strict';

/**
 * Event GuildCreate
 */
class GuildCreate {
  /**
    * Launch script
    * @param {Guild} guild
    * @return {Promise<Message>} message
    */
  async launch(guild) {
    /**
     * Save guild data
     */
    await this.createGuild({
      name: guild.name,
      id: guild.id,
      prefix: this.config.prefix,
      color: this.config.color,
    });
    /**
     * Send event
     */
    this.coreExchange.emit('guildCount',
        await this.shard.fetchClientValues('guilds.cache.size')
            .then((results) =>
              results.reduce((prev, guildCount) => prev + guildCount, 0),
            ));
    /**
     * Check bot permissions
     */
    if (!guild.me.hasPermission(['SEND_MESSAGES'], {
      checkAdmin: true,
      checkOwner: true,
    })) {
      return guild.owner.send(language('en', 'client_missing_permissions')
          .replace('{{map}}', `\`SEND_MESSAGES\``)).catch(() => {});
    };
  };
};

module.exports = GuildCreate;
