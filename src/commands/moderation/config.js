'use strict';
const Command = require('../../plugin/Command');
const language = require('../../translate');

/**
 * Command class
 */
class Config extends Command {
  /**
   * @param {Client} client - Client
   */
  constructor(client) {
    super(client, {
      name: 'config',
      category: 'util',
      description: 'command_config_description',
      usage: 'config [set [config]]',
      nsfw: false,
      enable: true,
      guildOnly: true,
      aliases: ['conf', 'configue', 'configuration'],
      mePerm: ['MANAGE_GUILD', 'EMBED_LINKS'],
      userPerm: ['MANAGE_GUILD'],
    });
    this.client = client;
  };
  /**
   * @param {Message} message - message
   * @param {Array} query - arguments
   * @param {Object} options - options
   * @param {Object} options.guild - guild data
   * @return {Message}
   */
  launch(message, query, {guild}) {
    switch (query.shift()) {
      case 'set':
        const querySelector = query.join(' ').split(';');
        const contructorDefault =
          ['color', 'prefix', 'language', 'color',
            'welcome_channel', 'welcome_active',
            'goodbye_channel', 'goodbye_active'];
        if (querySelector.join('') === '') {
          return message.reply(language(guild.lg, 'command_config_listSetting')
              .replace('{{key}}', contructorDefault.join(', ')));
        };
        for (const key of querySelector) {
          if (key === '') continue;
          const settingContructor = key.split('=')[0];
          if (contructorDefault.includes(settingContructor.trim())) {
            continue;
          } else {
            return message.reply(language(guild.lg,
                'command_config_keyNotMatch')
                .replace('{{key}}', settingContructor));
          };
        };
        const entries = [];
        querySelector.forEach((item) => {
          item = item.replace('language', 'lg').trim();
          item !== '' ? entries.push(item.split('=')) : null;
        });
        const settings = Object.fromEntries(entries);
        this.client.updateGuild(message.guild, settings).finally(() => {
          message.channel.send(
              language(guild.lg, 'command_config_successUpdate')
                  .replace('{{map}}', `\n> ${entries.join('\n> ')
                      .replace(/,+/g, ' = ').replace('lg', 'language')}`));
        });
        break;

      default:
        message.channel.send({embed: {
          color: guild.color,
          title: language(guild.lg, 'command_config_title')
              .replace('{{prefix}}', guild.prefix || this.client.prefix),
          url: 'http://anikami.fr',
          author: {
            name: message.author.username,
            icon_url: message.author
                .displayAvatarURL({format: 'webp', dynamic: true}),
            url: 'http://anikami.fr',
          },
          description: language(guild.lg, 'command_config_description'),
          thumbnail: {
            url: message.guild.iconURL({format: 'webp', dynamic: true}),
          },
          fields: [
            {
              name: language(guild.lg, 'world_prefix'),
              value: String(guild.prefix),
              inline: true,
            },
            {
              name: language(guild.lg, 'world_language'),
              value: String(guild.lg),
              inline: true,
            },
            {
              name: language(guild.lg, 'world_color'),
              value: String(guild.color),
              inline: true,
            },
            {
              // eslint-disable-next-line max-len
              name: `${language(guild.lg, 'world_channel')} ${language(guild.lg, 'world_welcome')}`,
              // eslint-disable-next-line max-len
              value: `${language(guild.lg, 'world_active')}: ${guild.welcome_active} | ${language(guild.lg, 'world_channel')}: ${guild.welcome_channel}`,
              inline: true,
            },
            {
              // eslint-disable-next-line max-len
              name: `${language(guild.lg, 'world_channel')} ${language(guild.lg, 'world_goodbye')}`,
              // eslint-disable-next-line max-len
              value: `${language(guild.lg, 'world_active')}: ${guild.goodbye_active} | ${language(guild.lg, 'world_channel')}: ${guild.goodbye_channel}`,
              inline: true,
            },
          ],
          timestamp: new Date(),
          footer: {
            text: this.client.user.username,
            icon_url: this.client.user
                .displayAvatarURL({format: 'webp', dynamic: true, size: 2048}),
          },
        }});
        break;
    }
  };
};

module.exports = Config;
