const mongoose = require('mongoose');
const {User} = require('./../lib');

module.exports = (client) => {
  client.getUser = async (user) => {
    const data = await User.findOne({id: String(user.id)});
    if (!data) return null;
    return data;
  };

  client.updateUser = async (user, settings) => {
    let data = await client.getUser(user);
    if (typeof data !== 'object') data = {};
    for (const key in settings) {
      if (data[key] !== settings[key]) data[key] = settings[key];
    };
    return data.updateOne(settings);
  };

  client.createUser = async (settings) => {
    // eslint-disable-next-line new-cap
    const merged = Object.assign({_id: mongoose.Types.ObjectId()}, settings);
    const createUser = await new User(merged);
    return await createUser.save();
  };
};
