/* eslint-disable */
'use strict';
const express = require('express');
const app = express();
const {User, AuthUser, Guild, AuthGuild} = require('./../database/lib');
const axios = require('axios');
const base64 = require('./../plugin/base64');
const language = require('./../i18n');

module.exports = function(client) {
  client.site = require('http').createServer(app)
      .listen(8030, 'localhost', () =>
        console.log(`App listening on 8030`));

  app.use(function(req, res, next) {
    console.log(`API has been called with this url: ${req.url}`);
    next();
  });

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers',
        'X-Requested-With,content-type,Authorization');
    if ('OPTIONS' == req.method) {
      res.sendStatus(204);
    } else {
      next();
    };
  });

  app.use(express.json());
  app.use(express.urlencoded({extended: true}));

  /** API NEW OHORI.ME */
  const cmd = {};
  // eslint-disable-next-line guard-for-in
  for (const key of client.commands) {
    cmd[key[0]] = {
      help: key[1].help,
      conf: key[1].conf,
    };
  };
  app.get('/command', (req, res) => {
    return res.status(202).json(cmd);
  });

  app.get('/servers', async (req, res) => {
    return res.status(202).json(await client.shard.fetchClientValues('guilds.cache'));
  });

  app.get('/guilds', async (req, res) => {
    return res.status(202).json(await Guild.find());
  });

  app.get('/guild/:id', async (req, res) => {
    const guild = await Guild.findOne({id: req.params.id});
    if (!guild) return res.status(404).json({error: true, message: 'guild not found'});
    return res.status(202).json(guild);
  });

  app.post('/guild/purchase', async (req, res) => {
    const guild = await Guild.findOne({id: req.body.id});
    if (!guild) return res.status(404).json({error: true, message: 'guild not found'});
    if ((req.headers.authorization !== client.config.authorization)
      && (req.headers.authorization !== await AuthGuild.findOne({id: req.body.id}).token)) return res.status(403).json({error: true, message: 'authorization refused'});
    let store = await axios({url: 'https://cdn.ohori.me/store.json', method: 'GET', headers: {'Content-Type': 'application/json'}})
      .then(response => response.data).catch(e => e);
    if (!store) return res.status(404).json({error: true, message: 'store not found'});
    const serialize = [];
    for (const key in store.category) {
      store.category[key].id = key;
      serialize.push(store.category[key]);
    };
    if (!serialize.some(v => v.id === req.body.item)) return res.status(404).json({error: true, message: 'item not found'});
    const item = serialize.find(v => v.id === req.body.item);
    if (guild.items.some(v => v.id === item.id)) return res.status(400).json({error: true, message: 'guild has already this item'});
    if (guild.coins < item.price) return res.status(400).json({error: true, message: 'insufficient balance'});
    guild.items.push(item);
    return res.status(202).json(await client.updateGuild(guild, {
      coins: guild.coins - item.price,
      items: guild.items,
    }).then(() => {return {error: false, message: 'OK'}}).catch((e) => {return {error: true, message: e.message}}));
  });

  app.post('/guild/setbanner', async (req, res) => {
    const guild = await Guild.findOne({id: req.body.id});
    if (!guild) return res.status(404).json({error: true, message: 'guild not found'});
    if ((req.headers.authorization !== client.config.authorization)
      && (req.headers.authorization !== await AuthGuild.findOne({id: req.body.id}).token)) return res.status(403).json({error: true, message: 'authorization refused'});
    if (!guild.items.some(v => v.id === req.body.item)) return res.status(404).json({error: true, message: 'item not found'});
    const item = guild.items.find(v => v.id === req.body.item);
    return res.status(202).json(await client.updateGuild(guild, {
      banner: {
        id: item.id,
        extension: item.extension,
      },
    }).then(() => {return {error: false, message: 'OK'}}).catch((e) => {return {error: true, message: e.message}}));
  });

  app.post('/guild/token', async (req, res) => {
    const guild = await Guild.findOne({id: req.body.id});
    if (!guild) return res.status(404).json({error: true, message: 'guild not found'});
    const auth = await AuthGuild.findOne({id: req.body.id})
    if ((req.headers.authorization !== client.config.authorization)
      && (req.headers.authorization !== auth.token)) return res.status(403).json({error: true, message: 'authorization refused'});
    return res.status(202).json({token: auth.token});
  });

  app.post('/guild/refreshtoken', async (req, res) => {
    const guild = await Guild.findOne({id: req.body.id});
    if (!guild) return res.status(404).json({error: true, message: 'guild not found'});
    const auth = await AuthGuild.findOne({id: req.body.id})
    if ((req.headers.authorization !== client.config.authorization)
      && (req.headers.authorization !== auth.token)) return res.status(403).json({error: true, message: 'authorization refused'});
      return res.status(202).json(await client.updateAuthGuild(guild, {
        token: `${base64(req.body.id)}.${base64(process.pid)}.${base64(Date.now())}`,
      }).then(() => {return {error: false, message: 'OK', token: `${base64(req.body.id)}.${base64(process.pid)}.${base64(Date.now())}`}}).catch((e) => {return {error: true, message: e.message}}));
  });

  
  app.get('/i18n/:lg/:query', (req, res) => {
    return res.status(202).send(language(req.params.lg, req.params.query));
  });

  app.get('/users', async (req, res) => {
    return res.status(202).json(await User.find());
  });

  app.get('/user/:id', async (req, res) => {
    const users = await User.findOne({id: req.params.id});
    if (!users) return res.status(404).json({error: true, message: 'user not found'});
    return res.status(202).json(users);
  });

  app.post('/user/purchase', async (req, res) => {
    const user = await User.findOne({id: req.body.id});
    if (!user) return res.status(404).json({error: true, message: 'user not found'});
    if ((req.headers.authorization !== client.config.authorization)
      && (req.headers.authorization !== await AuthUser.findOne({id: req.body.id}).token)) return res.status(403).json({error: true, message: 'authorization refused'});
    let store = await axios({url: 'https://cdn.ohori.me/store.json', method: 'GET', headers: {'Content-Type': 'application/json'}})
      .then(response => response.data).catch(e => e);
    if (!store) return res.status(404).json({error: true, message: 'store not found'});
    const serialize = [];
    for (const key in store.category) {
      store.category[key].id = key;
      serialize.push(store.category[key]);
    };
    if (!serialize.some(v => v.id === req.body.item)) return res.status(404).json({error: true, message: 'item not found'});
    const item = serialize.find(v => v.id === req.body.item);
    if (user.items.some(v => v.id === item.id)) return res.status(400).json({error: true, message: 'user has already this item'});
    if (user.coins < item.price) return res.status(400).json({error: true, message: 'insufficient balance'});
    user.items.push(item);
    return res.status(202).json(await client.updateUser(user, {
      coins: user.coins - item.price,
      items: user.items,
    }).then(() => {return {error: false, message: 'OK'}}).catch((e) => {return {error: true, message: e.message}}));
  });

  app.post('/user/setbanner', async (req, res) => {
    const user = await User.findOne({id: req.body.id});
    if (!user) return res.status(404).json({error: true, message: 'user not found'});
    if ((req.headers.authorization !== client.config.authorization)
      && (req.headers.authorization !== await AuthUser.findOne({id: req.body.id}).token)) return res.status(403).json({error: true, message: 'authorization refused'});
    if (!user.items.some(v => v.id === req.body.item)) return res.status(404).json({error: true, message: 'item not found'});
    const item = user.items.find(v => v.id === req.body.item);
    return res.status(202).json(await client.updateUser(user, {
      banner: {
        id: item.id,
        extension: item.extension,
      },
    }).then(() => {return {error: false, message: 'OK'}}).catch((e) => {return {error: true, message: e.message}}));
  });

  app.post('/user/token', async (req, res) => {
    const user = await User.findOne({id: req.body.id});
    if (!user) return res.status(404).json({error: true, message: 'user not found'});
    const auth = await AuthUser.findOne({id: req.body.id})
    if ((req.headers.authorization !== client.config.authorization)
      && (req.headers.authorization !== auth.token)) return res.status(403).json({error: true, message: 'authorization refused'});
    return res.status(202).json({token: auth.token});
  });

  app.post('/user/refreshtoken', async (req, res) => {
    const user = await User.findOne({id: req.body.id});
    if (!user) return res.status(404).json({error: true, message: 'user not found'});
    const auth = await AuthUser.findOne({id: req.body.id})
    if ((req.headers.authorization !== client.config.authorization)
      && (req.headers.authorization !== auth.token)) return res.status(403).json({error: true, message: 'authorization refused'});
      return res.status(202).json(await client.updateAuthUser(user, {
        token: `${base64(req.body.id)}.${base64(process.pid)}.${base64(Date.now())}`,
      }).then(() => {return {error: false, message: 'OK', token: `${base64(req.body.id)}.${base64(process.pid)}.${base64(Date.now())}`}}).catch((e) => {return {error: true, message: e.message}}));
  });
};
