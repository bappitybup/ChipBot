// #region Initilisation

const fs = require('fs');
const Discord = require('discord.js');
const { token } = require('./config.json');
const { prefix, version, defaultCommandCooldown, adminRoles } = require('./commandVars.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

client.once('ready', () => {
    console.log('ChipBot v' + version + ' active');
    client.user.setActivity('with logic | ;help');
});

// #endregion
// #region Main Code

client.on('message', message => {

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    // #region `aliases: ['test1', 'test2']` code
    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;
    // #endregion

    // #region `guildOnly: true/false` code
    if (command.guildOnly && message.channel.type !== 'text') {
        return message.reply('I can\'t execute that command inside DMs!');
    }
    // #endregion

    // #region `adminOnly: true/false` code
    //let myRole = message.guild.roles.get("264410914592129025");

    if (command.adminOnly) {
        if (message.guild === null) return message.channel.send("<:x:705168468760199178> **Admin** commands can only be used in guilds!");;

        var commandAccess = true;
        for (i = 0; i < adminRoles.length; i++)
        {
            if (!message.member.roles.cache.some(role => role.name === adminRoles[i])) {
                commandAccess = false;
            } else {
                commandAccess = true;
                break;
            }
        }

        if (commandAccess === false) return message.channel.send("<:x:705168468760199178> **Admin** status required to run this command!");

    }
    // #endregion

    // #region `args: true/false` & `usage: '<test1> <test2>'` code
    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

        // #region `usage: '<test1> <test2>'` code
        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }
        // #endregion

        return message.channel.send(reply);
    }
    // #endregion

    // #region `cooldown: 0` code
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || defaultCommandCooldown) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    } else {
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }
    // #endregion

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }

});

client.login(token);

// #endregion