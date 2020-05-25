'use strict';

const Command = require('../../plugin/Command');
const language = require('../../i18n');

/**
 * Help command
 */
class Help extends Command {
  /**
   * @param {Client} client - Client
   */
  constructor(client) {
    super(client, {
      name: 'help',
      category: 'util',
      description: 'command_help_description',
      usage: 'help (command)',
      nsfw: false,
      enable: true,
      guildOnly: false,
      aliases: ['h'],
      mePerm: ['EMBED_LINKS'],
    });
    this.client = client;
  };
  /**
   * @param {Message} message - message
   * @param {Array<String>} query - arguments
   * @param {Object} options - options
   * @param {Object} options.guild - guild data
   * @return {Promise<Message>}
   */
  launch(message, query, {guild}) {
    /**
     * Check if it's query
     */
    if (query.join(' ')) {
      /**
       * Check if command exist
       */
      if (!this.client.commands.has(query.join(' ').trim()) &&
      !this.client.aliases.has(query.join(' ').trim())) {
        return message.reply(language(guild.lg, 'command_not_found'));
      };
      /**
       * Get command
       */
      const command = this.client.commands.get(query.join(' ').trim()) ||
        this.client.commands.get(
            this.client.aliases.get(query.join(' ').trim()),
        );
      /**
       * Send message
       */
      // eslint-disable-next-line max-len
      return message.reply(`${language(guild.lg, 'command_help_command')}\`\`\`autohotkey\n%    help    %\nname :: ${command.help.name}\ndescription :: ${language(guild.lg, command.help.description)}\ncategory :: ${command.help.category}\nusage :: ${command.help.usage}\n\n%    config    %\nenable :: ${command.conf.enable}\aliases :: ${'[ ' + command.conf.aliases.join(', ') + ' ]'}\nnsfw :: ${command.conf.nsfw}\nuserPerm :: ${'[ ' + command.conf.userPerm.join(', ') + ' ]'}\`\`\``);
    };
    const cmd = {};
    for (const key of this.client.commands.filter((c) =>
      c.help.category !== 'developer')) {
      if (!cmd[key[1].help.category]) {
        cmd[key[1].help.category] = [];
      };
      cmd[key[1].help.category].push(key[1]);
    };
    const content = {
      embed: {
        title: language(guild.lg, 'command_help_title'),
        color: guild.color,
        url: 'http://anikami.fr',
        author: {
          name: message.author.username,
          icon_url: message.author
              .displayAvatarURL({format: 'webp', dynamic: true}),
          url: 'http://anikami.fr',
        },
        thumbnail: {
          url: message.guild.iconURL({format: 'webp', dynamic: true}),
        },
        fields: [],
        timestamp: new Date(),
        footer: {
          text: this.client.user.username,
          icon_url: this.client.user
              .displayAvatarURL({format: 'webp', dynamic: true, size: 2048}),
        },
      },
    };
    // eslint-disable-next-line guard-for-in
    for (const key in cmd) {
      content.embed.fields.push({
        name: `**${cmd[key].length} · ${key}**`,
        value: '`' + cmd[key].map((v) => v.help.name).join('`, `') + '`',
        inline: false,
      });
    };
    return message.channel.send(content);
  };
};

module.exports = Help;
