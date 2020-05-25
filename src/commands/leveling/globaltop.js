/* eslint-disable */
'use strict';
const Command = require('../../plugin/Command');
const {User} = require('../../database/lib');
const language = require('./../../i18n');

/**
 * Get algorithme
 * @param {number} messages
 * @return {object}
 */
function calculatepoint(messages) {
  const algos = {
    messages,
  };
  algos.xp = algos.messages/1.25;
  algos.difficulty = 1.75;
  algos.base = 100*algos.difficulty;
  algos.level = Math.ceil((algos.difficulty*algos.xp)/(algos.difficulty*algos.base));
  algos.ratio = (algos.difficulty*algos.xp)/((algos.difficulty*algos.base)*algos.level)
  return algos;
};

/**
 * Command class
 */
class GlobalTop extends Command {
  /**
   * @param {Client} client - Client
   */
  constructor(client) {
    super(client, {
      name: 'globaltop',
      category: 'leveling',
      description: 'command_globaltop_description',
      usage: 'globaltop',
      nsfw: false,
      enable: true,
      guildOnly: false,
      aliases: ['gtop', 'glevels'],
      mePerm: ['EMBED_LINKS'],
    });
    this.client = client;
  };
  /**
   * @param {Message} message - message
   * @param {Array} query - query
   * @param {Object} options - options
   * @param {Object} options.guild - guild data
   * @param {Object} options.user - user data
   * @return {Message}
   */
  async launch(message, query, {guild, user}) {
    const users = await User.find();
    /**
     * All board users and sort
     * @type {Array<object>}
     */
    const rawBoard = users.sort((a, b) =>  b.messageCount - a.messageCount);
    const embed = {
      title: language(guild.lg, 'command_globaltop_embed_title'),
      fields: [],
    };
   for (const user in rawBoard.slice(0, 6)) {
    embed.fields.push({
      name: `#${Number(user)+1} - ${rawBoard[user].name}`,
      value: `${calculatepoint(rawBoard[user].messageCount).xp} xp`,
      inline: true,
    });
   };
   message.channel.send({embed});
  };
};

module.exports = GlobalTop;
