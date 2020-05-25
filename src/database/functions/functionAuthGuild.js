const mongoose = require('mongoose');
const {AuthGuild} = require('./../lib');

module.exports = (client) => {
  client.getAuthGuild = async (guild) => {
    const data = await AuthGuild.findOne({id: String(guild.id)});
    if (!data) return null;
    return data;
  };

  client.updateAuthGuild = async (guild, settings) => {
    let data = await client.getAuthGuild(guild);
    if (typeof data !== 'object') data = {};
    for (const key in settings) {
      if (data[key] !== settings[key]) data[key] = settings[key];
    };
    return data.updateOne(settings);
  };

  client.createAuthGuild = async (settings) => {
    // eslint-disable-next-line new-cap
    const merged = Object.assign({_id: mongoose.Types.ObjectId()}, settings);
    const createGuild = await new AuthGuild(merged);
    return await createGuild.save();
  };
};
