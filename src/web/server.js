/* eslint-disable */
'use strict';
const express = require('express');
const app = express();
const serializeJSON = require('../plugin/SerializeJSON');
const {User} = require('./../database/lib');
const axios = require('axios');

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
  app.get('/guilds', async (req, res) => {
    return res.status(202).json(await client.shard.fetchClientValues('guilds.cache'));
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
    if (req.headers.authorization !== client.config.authorization) return res.status(403).json({error: true, message: 'authorization refused'});
    const user = await User.findOne({id: req.body.id});
    if (!user) return res.status(202).json({error: true, message: 'user not found'});
    let store = await axios({url: 'https://cdn.ohori.me/store.json', method: 'GET', headers: {'Content-Type': 'application/json'}})
      .then(response => response.data).catch(e => e);
    store = serializeJSON(store['background']);
    if (!store) return res.status(202).json({error: true, message: 'store not found'});
    if (!store.some(v => v.id === req.body.item)) return res.status(202).json({error: true, message: 'item not found'});
    const item = store.find(v => v.id === req.body.item)
    if (user.items.some(v => v.id === item.id)) return res.status(202).json({error: true, message: 'user has already this item'});
    if (user.coins < item.price) return res.status(202).json({error: true, message: 'insufficient balance'});
    user.items.push(item);
    return res.status(202).json(await client.updateUser(user, {
      coins: user.coins - item.price,
      items: user.items,
    }).then(() => {return {error: false, message: 'OK'}}).catch((e) => {return {error: true, message: e.message}}));
  });
  app.post('/user/setbanner', async (req, res) => {
    const user = await User.findOne({id: req.body.id});
    if (!user) return res.status(404).json({error: true, message: 'user not found'});
    if (!user.items.some(v => v.id === req.body.item)) return res.status(404).json({error: true, message: 'item not found'});
    const item = user.items.find(v => v.id === req.body.item);
    return res.status(202).json(await client.updateUser(user, {
      banner: {
        id: item.id,
        extension: [item.extension, 'png'],
      },
    }).then(() => {return {error: false, message: 'OK'}}).catch((e) => {return {error: true, message: e.message}}));
  });
};
