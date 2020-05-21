'use strict';
/**
 * Template for command
 */
class Command {
  /**
    * @param {*} client - Client
    * @param {Object} param1 - help & conf
    */
  constructor(client, {
    name = null,
    description = null,
    category = 'user',
    usage = null,
    nsfw = false,
    enable = true,
    guildOnly = true,
    userPerm = [],
    mePerm = [],
    aliases = [],
    bypass = false,
  }) {
    this.client = client;
    this.help = {name, description, category, usage};
    this.conf = {enable, guildOnly, aliases, nsfw, userPerm, mePerm, bypass};
  };
};

module.exports = Command;
