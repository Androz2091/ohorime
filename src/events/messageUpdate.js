'use strict';
const language = require('./../i18n');
/**
 * Event MessageUpdate
 */
class MessageUpdate {
  /**
   * @param {Message} oldMessage - old message
   * @param {Message} newMessage - new message
   * @return {?Promise<Message>}
   */
  async launch(oldMessage, newMessage) {
    const message = newMessage;
    /**
     * Check type message, if author is a bot, message edited
     */
    if (!message.author || message.author.bot || message.system ||
        message.edits.length > 1) return false;
    let guild;
    /**
     * Check if guild is in message
     */
    if (message.guild) {
      /**
       * Get guild data
       */
      guild = await this.getGuild(message.guild);
    };
    /**
     * Get user data
     */
    const user = await this.getUser(message.author);
    /**
     * Set mutli prefix
     */
    let query;
    if (message.content.toLowerCase()
        .startsWith(this.config.prefix.toLowerCase())) {
      query = message.content
          .slice(this.config.prefix.length).trim().split(/ +/g);
    } else if (message.content.toLowerCase()
        .startsWith(this.user.username.toLowerCase())) {
      query = message.content
          .slice(this.user.username.length).trim().split(/ +/g);
    } else if (message.mentions.users.first() &&
        message.mentions.users.first().id === this.user.id) {
      query = message.content
          .slice(this.user.username.length).trim().split(/ +/g);
      query.shift();
    } else return;
    const command = query.shift().toLowerCase();
    /**
     * If bot can send message
     */
    if (message.guild && !message.guild.me.hasPermission(['SEND_MESSAGES'], {
      checkAdmin: true,
      checkOwner: true,
    })) return;
    /**
     * Create fake guild data
     */
    if (!guild) {
      guild = {
        lg: 'en',
        color: this.client.config.color,
      };
    };
    /**
     * check if this command exist
     */
    if (!this.commands.has(command) && !this.aliases.has(command)) {
      return message.reply(language(guild.lg, 'command_not_found'));
    };
    /**
     * Get command
     */
    const cmd = this.commands.get(command) ||
      this.commands.get(this.aliases.get(command));
    /**
     * Check bot permisisons
     */
    if (message.guild &&
       !cmd.bypass &&
       !message.guild.me.hasPermission(cmd.conf.mePerm, {
         checkAdmin: true,
         checkOwner: true,
       })) {
      return message.reply(language(guild.lg, 'client_missing_permissions')
          .replace('{{map}}', `\`${cmd.conf.mePerm.join('`, `')}\``));
    };
    /**
     * Check user permissions
     */
    if (message.guild &&
      !cmd.bypass &&
      !message.member.hasPermission(cmd.conf.userPerm, {
        checkAdmin: true,
        checkOwner: true,
      })) {
      return message.reply(language(guild.lg, 'member_missing_permission'));
    };
    /**
     * Check if channel is nsfw
     */
    if (cmd.conf.nsfw &&
      !cmd.bypass &&
      message.guild &&
      !message.channel.nsfw) {
      return message.reply(language(guild.lg, 'command_nsfw_not_authorized'));
    };
    /**
     * Check if channel is in guild
     */
    if (cmd.conf.guildOnly &&
      !cmd.bypass &&
      !message.guild) {
      return message.reply(language(guild.lg, 'command_dm_not_authorized'));
    };
    /**
     * Check if command is enable
     */
    if (!cmd.conf.enable && !cmd.bypass) {
      return message.reply(language(guild.lg, 'command_disable'));
    };
    try {
      /** Execute command */
      cmd.launch(message, query, {user, guild});
    } catch (error) {
      console.warn(error);
      if (!client.ws.status) return;
      const guild = client.guilds.get('612430086624247828');
      if (!guild) return;
      const channel = guild.channels.get('707414291355271220');
      channel.send(error, {code: 'js'});
    };
  };
};

module.exports = MessageUpdate;
