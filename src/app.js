'use strict';
const {Client, Collection} = require('discord.js');
const {readdirSync} = require('fs');
const {DISCORD_TOKEN, CONFIG} = require('./../configuration');
const {JpopClient, KpopClient} = require('./client');
const coreExchange = new (require('./plugin/CoreExchange'))();
const klaw = require('klaw');
const {parse, sep} = require('path');

/**
 * Class Akira exents Client
 * @class
 */
class AkiraClient extends Client {
  /**
  * Constructor options https://discord.js.org/#/docs/main/master/typedef/ClientOptions
  * @param {Object} options
  */
  constructor(options) {
    super(options);
    this.commands = new Collection();
    this.aliases = new Collection();
    this.config = CONFIG;
    this.mongoose = require('./database/mongoose');
    this.logger = require('./plugin/Logger');
    this.music = {};
    this.jpop = {
      broadcast: null,
      dispatcher: null,
      ws: new JpopClient(),
      data: null,
    };
    this.kpop = {
      broadcast: null,
      dispatcher: null,
      ws: new KpopClient(),
      data: null,
    };
    this.anime = {};
    this.coreExchange = coreExchange;
    this.s = {};
  };
  /**
  * Load events file
  * @param {String} eventPath - path to event
  */
  loadEvent(eventPath) {
    try {
      const RequireEvent = require(`./events/${eventPath}`);
      const event = new RequireEvent(this);
      const eventName = eventPath.split('.')[0];
      this.on(eventName, event.launch.bind(this));
      this.logger.log(`${eventName} loaded !`);
    } catch (error) {
      this.logger.error(eventPath);
      console.error(error);
    };
  };
  /**
   * Load commands file
   * @param {String} commandPath - path to command
   */
  loadCommand(commandPath) {
    try {
      const RequireCommand = require(commandPath);
      const command = new RequireCommand(this);
      this.commands.set(command.help.name, command);
      command.conf.aliases.forEach((alias) => {
        this.aliases.set(alias, command.help.name);
      });
      this.logger.log(`${command.help.name} loaded !`);
    } catch (error) {
      console.error(error);
    };
  };
};
const client = new AkiraClient({
  http: {
    api: 'https://discordapp.com/api',
    cdn: 'https://cdn.discordapp.com',
  },
  fetchAllMembers: true,
  ws: {
    intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_EMOJIS',
      'GUILD_VOICE_STATES', 'GUILD_PRESENCES', 'GUILD_MESSAGES',
      'GUILD_MESSAGE_REACTIONS', 'DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS'],
  },
  partials: ['MESSAGE', 'REACTION'],
});
require('./database/functions')(client);

const eventFiles = readdirSync('./src/events/');

// eslint-disable-next-line guard-for-in
for (const file in eventFiles) {
  client.loadEvent(eventFiles[file]);
};

klaw('./src/commands').on('data', (item) => {
  const cmdFile = parse(item.path);
  if (!cmdFile.ext || cmdFile.ext !== '.js') return;
  client.loadCommand(
      `${cmdFile.dir}${sep}${cmdFile.name}${cmdFile.ext}`,
  );
});

client.mongoose.init();
client.login(DISCORD_TOKEN).catch(client.logger.error);

client.jpop.ws.connect();
client.jpop.ws.on('event', (data) => client.jpop.data = data);
client.jpop.ws.on('open', () => console.log('Jpop broadcast connected'));
client.jpop.ws.on('close', () => console.log('Jpop broadcast disconnected'));

client.kpop.ws.connect();
client.kpop.ws.on('event', (data) => client.kpop.data = data);
client.kpop.ws.on('open', () => console.log('Kpop broadcast connected'));
client.kpop.ws.on('close', () => console.log('Kpop broadcast disconnected'));

client.on('debug', client.logger.debug);
client.on('error', client.logger.error);

process.on('uncaughtException', (error) => {
  console.warn(error);
  if (!client) return;
  const guild = client.guilds.cache.get('612430086624247828');
  if (!guild) return;
  const channel = guild.channels.cache.get('707414291355271220');
  channel.send(error, {code: 'js'});
});
process.on('unhandledRejection', (listener) => {
  console.warn(listener);
  if (!client) return;
  const guild = client.guilds.cache.get('612430086624247828');
  if (!guild) return;
  const channel = guild.channels.cache.get('707414291355271220');
  channel.send(listener, {code: 'js'});
});
process.on('rejectionHandled', (listener) => {
  console.warn(listener);
  if (!client) return;
  const guild = client.guilds.cache.get('612430086624247828');
  if (!guild) return;
  const channel = guild.channels.cache.get('707414291355271220');
  channel.send(listener, {code: 'js'});
});
process.on('warning', (warning) => {
  console.warn(warning);
  if (!client) return;
  const guild = client.guilds.cache.get('612430086624247828');
  if (!guild) return;
  const channel = guild.channels.cache.get('707414291355271220');
  channel.send(warning, {code: 'js'});
});

module.exports = AkiraClient;
