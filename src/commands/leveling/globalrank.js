/* eslint-disable */
'use strict';
const Command = require('../../plugin/Command');
const {Canvas} = require('canvas-constructor');
const {loadImage} = require('canvas');
const {MessageAttachment} = require('discord.js');

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
class GlobalRank extends Command {
  /**
   * @param {Client} client - Client
   */
  constructor(client) {
    super(client, {
      name: 'globalrank',
      category: 'leveling',
      description: 'command_globalrank_description',
      usage: 'rank',
      nsfw: false,
      enable: true,
      guildOnly: false,
      aliases: ['grank'],
      mePerm: ['ATTACH_FILES'],
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
    const queryMember = query.join(' ');
    const member = message.mentions.members.first() ||
        message.guild.member(
            message.mentions.users.first(),
        ) ||
        message.guild.members.cache.find((member) =>
          member.id === queryMember) ||
        message.guild.members.cache.find((member) =>
          member.displayName === queryMember) ||
        message.guild.members.cache.find((member) =>
          member.user.username === queryMember) ||
        message.guild.members.cache.find((member) =>
          member.toString() === queryMember) ||
        message.member;
    const name = member.displayName.length > 20 ?
      member.displayName.substring(0, 17) + '...' : member.displayName;

    const point = calculatepoint(user.messageCount);

    const avatar = await loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
    const background = await loadImage(`https://cdn.ohori.me/store/${user.banner.id}.${
      user.banner.extension.includes('png') ?
      user.banner.extension[user.banner.extension.findIndex((e) => e === 'png')] :
      user.banner.extension[user.banner.extension.findIndex((e) => e === 'jpg')]
    }`);

    const buffer = new Canvas(400, 180)
        .setColor('#7289DA')
        .addImage(background, 84, 0, 316, 180, {restore: true})
        // .addRect(84, 0, 316, 180)
        .setColor('#2C2F33')
        .addRect(0, 0, 84, 180)
        .addRect(169, 26, 231, 46)
        .addRect(224, 108, 176, 46)
        .setShadowColor('rgba(22, 22, 22, 1)')
        .setShadowOffsetY(5)
        .setShadowBlur(10)
        .addCircle(84, 90, 62)
        // eslint-disable-next-line max-len
        .addCircularImage(avatar, 86, 86, 64)
        .save()
        .createBeveledClip(20, 138, 128, 32, 5)
        .setColor('#23272A')
        .fill()
        .restore()
        .setTextAlign('center')
        .setTextFont('10pt sans')
        .setColor('#FFFFFF')
        .addText(name, 285, 54)
        .addText(`Level: ${point.level.toLocaleString()}`, 84, 159)
        .setTextAlign('left')
        .addText(`Score: ${Math.round(point.xp.toLocaleString())}`, 241, 136)
        .toBuffer();
    const fileName = `globalRank-${message.author.id}.png`;
    const attachment = new MessageAttachment(buffer, fileName);
    await message.channel.send({files: [attachment]});
  };
};

module.exports = GlobalRank;
