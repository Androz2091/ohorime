const mongoose = require('mongoose');
const {Guild} = require('./../lib');

module.exports = (client) => {
  client.getGuild = async (guild) => {
    const data = await Guild.findOne({id: String(guild.id)});
    if (!data) return null;
    return data;
  };

  client.updateGuild = async (guild, settings) => {
    let data = await client.getGuild(guild);
    if (typeof data !== 'object') data = {};
    // eslint-disable-next-line guard-for-in
    for (const key in settings) {
      if (data[key] !== settings[key]) data[key] = settings[key];
      if (key === 'messageCount') {
        const allguild = await Guild.find();
        const result = allguild.map((guild) => guild.messageCount);
        const reducer = (accumulator, currentValue) =>
          accumulator + currentValue;
        client.coreExchange.emit('messageCount', result.reduce(reducer));
      };
    };
    return data.updateOne(settings);
  };

  client.createGuild = async (settings) => {
    // eslint-disable-next-line new-cap
    const merged = Object.assign({_id: mongoose.Types.ObjectId()}, settings);
    const createGuild = await new Guild(merged);
    return await createGuild.save();
  };

  client.deleteGuild = async (guild) => {
    Guild.deleteOne({id: guild.id});
  };
};
