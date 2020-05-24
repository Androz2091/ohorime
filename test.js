const fs = require("fs");
const { Client, Collection } = require('discord.js');
const { TOKEN, PREFIX } = require('./config');

client.on('ready', () => {
console.log('Connecté !');
client.user.setActivity("En Maintenance | *Help | By K3baBoSor")
})
const client = new Client();
client.commands = new Collection();

const commandfile = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandfiles) {}
const commands = require(`.commands/${file}`);
client.commands.set(command.name, command);
console.log(client.commands);

client.on('ready', () => {
console.log(l`ogged in as ${client.user.tag}!`);
});

client.on('message', message => {
if (!message.content.startsWith(PREFIX) || message.author.bot) return;
const args = message.content.slice(PREFIX.length).split(/ +/);
const command = args.shift().toLowerCase();

if (!client.commands.has(command)) return;
client.commands.get(command).execute(message, args);

});

client.login(TOKEN);