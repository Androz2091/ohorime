'use strict';

/**
 * Event GuildDelete
 */
class GuildDelete {
  /**
    * Launch script
    * @param {Guild} guild
    */
  async launch(guild) {
    /**
     * Send event
     */
    this.coreExchange.emit('guildCount',
        await this.shard.fetchClientValues('guilds.cache.size')
            .then((results) =>
              results.reduce((prev, guildCount) => prev + guildCount, 0),
            ));
  };
};

module.exports = GuildDelete;
