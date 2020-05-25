'use strict';
const Command = require('../../plugin/Command');
const language = require('../../i18n');

/**
 * Command class
 */
class Volume extends Command {
  /**
   * @param {Client} client - Client
   */
  constructor(client) {
    super(client, {
      name: 'volume',
      category: 'music',
      description: 'command_volume_description',
      usage: 'volume [volume] ?(boost)',
      nsfw: false,
      enable: true,
      guildOnly: true,
      aliases: [],
      mePerm: [
        'ADD_REACTIONS',
      ],
    });
    this.client = client;
  };
  /**
   * @param {Message} message - message
   * @param {Array} query - argument
   * @param {Object} options - options
   * @param {Object} options.guild - guild data
   * @return {Message}
   */
  async launch(message, query, {guild}) {
    if (!this.client.music[message.guild.id]) return message.react('💢');
    if (this.client.music[message.guild.id].dispatcher === null) {
      return message.reply(language(guild.lg, 'command_music_notPlaying'));
    };
    const player = new (require('./play'))(this.client);
    if (!player.hasPermission(message)) {
      return message.channel.send(
          language(guild.lg, 'command_volume_noPermission'),
      );
    };
    if (isNaN(query[0])) {
      return message.reply(
          language(guild.lg, 'value_is_not_a_number'),
      );
    };
    if (query[1] !== 'boost') {
      if (query[0] > 100 || query[0] < 1) {
        return message.reply(
            language(guild.lg, 'command_volume_useboost'),
        );
      };
    };
    guild.player_volume = query[0];
    await this.client.updateGuild(message.guild, {
      player_volume: guild.player_volume,
    });
    await this.client.music[message.guild.id].dispatcher
        .setVolume(query[0]/100);
    return message.reply(
        language(guild.lg, 'command_volume_defined')
            .replace('{{volume}}',
                this.client.music[message.guild.id].dispatcher.volume*100),
    );
  };
};

module.exports = Volume;
