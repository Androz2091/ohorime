'use strict';

/**
 * Event GuildMemberAdd
 */
class GuildMemberAdd {
  /**
    * Launch script
    * @param {GuildMember} member
    */
  async launch(member) {
    /**
     * Send event
     */
    this.coreExchange.emit('memberCount',
        // eslint-disable-next-line max-len
        await this.shard.broadcastEval('this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)')
            .then((results) =>
              results.reduce((prev, memberCount) => prev + memberCount, 0),
            ));
  };
};

module.exports = GuildMemberAdd;
