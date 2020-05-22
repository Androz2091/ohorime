'use strict';

const language = require('./../translate');
const base64 = require('./../plugin/base64');

/**
 * Event Message
 */
class Message {
  /**
   * @param {Message} message - message
   * @return {Promise<Message>}
   */
  async launch(message) {
    /**
     * Check message type and author bot
     */
    if (message.author.bot || message.system) return false;
    let guild; let user; let authUser;
    /**
     * Check message has guild
     */
    if (message.guild) {
      /**
       * Get guild
       */
      guild = await this.getGuild(message.guild);
      /**
       * If guild is null or undefined
       */
      if (!guild) {
        /**
         * Save guild data
         */
        guild = await this.createGuild({
          name: message.guild.name,
          id: message.guild.id,
          prefix: this.config.prefix,
          color: this.config.color,
          messageCount: 1,
        });
      } else {
        /**
         * Add message to messageCount
         */
        await this.updateGuild(message.guild, {
          messageCount: guild.messageCount+1,
        });
      };
    };
    /**
     * Get user data
     */
    user = await this.getUser(message.author);
    authUser = await this.getAuthUser(message.author);
    /**
     * If user is null or undefined
     */
    if (!user) {
      /**
       * Save user data
       */
      user = await this.createUser({
        name: message.author.username,
        id: message.author.id,
      });
      authUser = await this.createAuthUser({
        id: message.author.id,
        // eslint-disable-next-line max-len
        token: `${base64(message.author.id)}.${base64(process.pid)}.${base64(Date.now())}`,
      });
    };

    if (!authUser) {
      authUser = await this.createAuthUser({
        id: message.author.id,
        // eslint-disable-next-line max-len
        token: `${base64(message.author.id)}.${base64(process.pid)}.${base64(Date.now())}`,
      });
    };
    /**
     * Daily activity
     */
    if (!user.dailyActivity || user.dailyActivity.length === 0) {
      user.dailyActivity = [];
      user.dailyActivity.push({
        day: new Date().getDate(),
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
        messages: 1,
      });
    } else if (new Date(
        user.dailyActivity[user.dailyActivity.length - 1].year,
        user.dailyActivity[user.dailyActivity.length - 1].month,
        user.dailyActivity[user.dailyActivity.length - 1].day,
    ).toString() !== new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate()).toString()
    ) {
      user.dailyActivity.push({
        day: new Date().getDate(),
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
        messages: 1,
      });
    } else {
      user.dailyActivity[user.dailyActivity.length - 1].messages++;
    };
    /**
     * Check lenght of dailyActivity
     */
    if (user.dailyActivity.length > 124) {
      dailyActivity = dailyActivity.slice(user.dailyActivity.length-124,
          user.dailyActivity.length);
    };
    /**
     * Update user data
     */
    await this.updateUser(message.author, {
      messageCount: user.messageCount+1,
      dailyActivity: user.dailyActivity,
    });
    /**
     * If guild is null or undefined
     */
    if (!guild) {
      /**
       * Create fake guild data
       */
      guild = {
        lg: 'en',
        color: this.client.config.color,
      };
    };
    /**
     * Set mutli prefix
     */
    let query;
    if (message.content.toLowerCase()
        .startsWith(guild.prefix.toLowerCase())) {
      query = message.content
          .slice(guild.prefix.length).trim().split(/ +/g);
    } else if (message.content.toLowerCase()
        .startsWith(this.user.username.toLowerCase())) {
      query = message.content
          .slice(this.user.username.length).trim().split(/ +/g);
    } else if (message.content.startsWith('<@!704867756595478549>')) {
      query = message.content
          .slice(this.user.username.length).trim().split(/ +/g);
      query.shift();
    } else return;
    /**
     * If there is no command in the message
     */
    if (query.length < 1) return;
    const command = query.shift().toLowerCase();
    /**
     * If bot can send message
     */
    if (message.guild && !message.guild.me.hasPermission(['SEND_MESSAGES'], {
      checkAdmin: true,
      checkOwner: true,
    })) return;
    /**
     * check if this command exist
     */
    if (!this.commands.has(command) && !this.aliases.has(command)) return;
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

module.exports = Message;
