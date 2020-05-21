'use strict';
const {ShardingManager} = require('discord.js');
const {DISCORD_TOKEN: token} = require('./configuration');

const manager = new ShardingManager('./src/app.js', {
  token: token,
  totalShards: 2,
  shardList: 'auto',
  mode: 'process',
  respawn: true,
  execArgv: ['--trace-warnings'],
  shardArgs: ['--ansi', '--color'],
});

manager.spawn();

manager.on('shardCreate', (shard) => {
  shard.on('death', (Shardprocess) => {
    console.log(`[shard: ${shard.id}] has been dead`);
  });
  shard.on('disconnect', () => {
    console.log(`[shard: ${shard.id}] has been disconnected`);
  });
  shard.on('message', (message) => {
    console.log(`[shard: ${shard.id}] message -> ${message}`);
  });
  shard.on('ready', () => {
    console.log(`[shard: ${shard.id}] has been ready`);
  });
  shard.on('reconnecting', () => {
    console.log(`[shard: ${shard.id}] try make reconnection`);
  });
  shard.on('spawn', (Shardprocess) => {
    console.log(`[shard: ${shard.id}] has spawn`);
  });
});
