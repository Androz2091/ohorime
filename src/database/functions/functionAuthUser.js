const mongoose = require('mongoose');
const {AuthUser} = require('./../lib');

module.exports = (client) => {
  client.getAuthUser = async (user) => {
    const data = await AuthUser.findOne({id: String(user.id)});
    if (!data) return null;
    return data;
  };

  client.updateAuthUser = async (user, settings) => {
    let data = await client.getAuthUser(user);
    if (typeof data !== 'object') data = {};
    for (const key in settings) {
      if (data[key] !== settings[key]) data[key] = settings[key];
    };
    return data.updateOne(settings);
  };

  client.createAuthUser = async (settings) => {
    // eslint-disable-next-line new-cap
    const merged = Object.assign({_id: mongoose.Types.ObjectId()}, settings);
    const createUser = await new AuthUser(merged);
    return await createUser.save();
  };
};
