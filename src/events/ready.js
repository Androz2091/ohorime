'use strict';

const WebSocket = require('ws');
const {Guild} = require('./../database/lib');

/**
 * Event Ready
 */
class Ready {
  /**
    * Launch script
    */
  async launch() {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    /**
     * Indicator log
     */
    this.logger.log(`${this.user.username} is ready !`);
    /**
     * Fetch application
     */
    this.appInfo = await this.fetchApplication();
    /**
     * Update application all hours
     */
    setInterval(async () => {
      this.appInfo = await this.fetchApplication();
    }, 60000);
    let broadcastFollow = 0;
    /**
     * Create jpop broadcast
     */
    this.jpop.broadcast = this.voice.createBroadcast();
    /**
     * Create jpop dispatcher
     */
    this.jpop.dispatcher = this.jpop.broadcast.play('https://listen.moe/stream');
    /**
     * Events jpop broadcast and subscriber counter
     */
    this.jpop.broadcast.on('subscribe', (dispatcher) => {
      console.log('New broadcast subscriber!');
      const guild = dispatcher.player.voiceConnection.channel.guild;
      this.music[guild.id].broadcast = true;
      broadcastFollow++;
    });
    this.jpop.broadcast.on('unsubscribe', (dispatcher) => {
      console.log('Channel unsubscribed from broadcast :(');
      const guild = dispatcher.player.voiceConnection.channel.guild;
      this.music[guild.id].broadcast = false;
      broadcastFollow--;
    });
    /**
     * Create kpop broadcast
     */
    this.kpop.broadcast = this.voice.createBroadcast();
    /**
     * Create kpop dispatcher
     */
    this.kpop.dispatcher = this.kpop.broadcast.play('https://listen.moe/kpop/stream');
    /**
     * Events kpop broadcast and subscriber counter
     */
    this.kpop.broadcast.on('subscribe', (dispatcher) => {
      console.log('New broadcast subscriber!');
      const guild = dispatcher.player.voiceConnection.channel.guild;
      this.music[guild.id].broadcast = true;
      broadcastFollow++;
    });
    this.kpop.broadcast.on('unsubscribe', (dispatcher) => {
      console.log('Channel unsubscribed from broadcast :(');
      const guild = dispatcher.player.voiceConnection.channel.guild;
      this.music[guild.id].broadcast = false;
      broadcastFollow--;
    });
    /**
     * Set presence
     */
    this.user.setPresence({
      activity: {
        name: `les ${broadcastFollow} utilisateurs en train d'écoute la radio`,
        type: 'WATCHING',
        application: {
          id: '704867756595478549',
        },
      },
      status: 'dnd',
      afk: false,
    });
    /**
     * Update presence all hours
     */
    setInterval(async () => {
      this.user.setPresence({
        activity: {
          name: `${broadcastFollow} utilisateur écoute les radios`,
          type: 'WATCHING',
          application: {
            id: '704867756595478549',
          },
        },
        status: 'dnd',
        afk: false,
      });
    }, 60000);
    if (this.options.shards[0] === 0) {
      require('../web/server.js')(this);
      /** NEW WEBSOCKET OHORI.ME */
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const wss = new WebSocket.Server({
        port: 8006,
        perMessageDeflate: {
          zlibDeflateOptions: {
            // See zlib defaults.
            chunkSize: 1024,
            memLevel: 7,
            level: 3,
          },
          zlibInflateOptions: {
            chunkSize: 10 * 1024,
          },
          // Other options settable:
          clientNoContextTakeover: true, // Defaults to negotiated value.
          serverNoContextTakeover: true, // Defaults to negotiated value.
          serverMaxWindowBits: 10, // Defaults to negotiated value.
          // Below options specified as default values.
          concurrencyLimit: 10, // Limits zlib concurrency for perf.
          threshold: 1024, // Size (in bytes) below which messages
          // should not be compressed.
        },
      });
      this.logger.log('ws starting on ws://localhost:8006');
      /**
       * Heartbeat
       * @param {WebSocket} ws
       */
      function heartbeat(ws) {
        // eslint-disable-next-line no-invalid-this
        ws.isAlive = true;
      };

      wss.on('connection', async function connection(ws) {
        ws.isAlive = true;
        ws.on('message', function incoming(message) {
          if (JSON.parse(message).op === 9) heartbeat(ws);
        });

        ws.send(JSON.stringify({op: 0, d: {
          message: 'Welcome to ohori.me! Enjoy your stay!',
          heartbeat: 15000,
        }}));
        // MESSAGE EXCHANGE
        const allguild = await Guild.find();
        const result = allguild.map((guild) => guild.messageCount);
        const reducer = (accumulator, currentValue) =>
          accumulator + currentValue;

        ws.send(JSON.stringify({op: 1, d: {
          messageCount: result.reduce(reducer),
        }, t: 'MESSAGE_COUNT_UPDATE'}));

        // GUILD EXCHANGE
        ws.send(JSON.stringify({op: 1, d: {
          guildCount: await this.shard.fetchClientValues('guilds.cache.size')
              .then((results) =>
                results.reduce((prev, guildCount) => prev + guildCount, 0),
              ),
        }, t: 'GUILD_COUNT_UPDATE'}));

        // MEMBER EXCHANGE
        ws.send(JSON.stringify({op: 1, d: {
          // eslint-disable-next-line max-len
          memberCount: await this.shard.broadcastEval('this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)')
              .then((results) =>
                results.reduce((prev, memberCount) => prev + memberCount, 0),
              ),
        }, t: 'MEMBER_COUNT_UPDATE'}));
        // SHARD INFO
        ws.send(JSON.stringify({op: 1, d: {
          shards: await this.shard.broadcastEval(`
            const d = {
              ping: this.ws.ping,
              guilds: this.guilds.cache.size,
              users: this.users.cache.size,
              gateway: this.ws.gateway,
              status: this.ws.status,
              memoryUsage: process.memoryUsage(),
            };
            d;
          `),
        }, t: 'SHARD_UPDATE'}));
      }.bind(this));

      /* BROADCAST */

      setTimeout(function() {
        wss.clients.forEach(async function each(ws) {
          ws.send(JSON.stringify({op: 1, d: {
            shards: await this.shard.broadcastEval(`
              const d = {
                ping: this.ws.ping,
                guilds: this.guilds.cache.size,
                users: this.users.cache.size,
                gateway: this.ws.gateway,
                status: this.ws.status,
                memoryUsage: process.memoryUsage(),
              };
              d;
            `),
          }, t: 'SHARD_UPDATE'}));
        }.bind(this));
      }.bind(this), 60000);

      /* MESSAGE COUNT */
      this.coreExchange.on('messageCount', function(count) {
        wss.clients.forEach(function each(ws) {
          ws.send(JSON.stringify({op: 1, d: {
            messageCount: count,
          }, t: 'MESSAGE_COUNT_UPDATE'}));
        });
      });
      /* GUILD COUNT */
      this.coreExchange.on('guildCount', function(count) {
        wss.clients.forEach(function each(ws) {
          ws.send(JSON.stringify({op: 1, d: {
            guildCount: count,
          }, t: 'GUILD_COUNT_UPDATE'}));
        });
      });
      /* MEMBER COUNT */
      this.coreExchange.on('memberCount', function(count) {
        wss.clients.forEach(function each(ws) {
          ws.send(JSON.stringify({op: 1, d: {
            memberCount: count,
          }, t: 'MEMBER_COUNT_UPDATE'}));
        });
      });

      const interval = setInterval(function ping() {
        wss.clients.forEach(function each(ws) {
          if (ws.isAlive === false) return ws.terminate();
          ws.isAlive = false;
        });
      }, 30000);

      wss.on('close', function close() {
        clearInterval(interval);
      });
    };
  };
};

module.exports = Ready;
