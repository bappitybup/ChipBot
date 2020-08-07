// #region Initilisation

const fs = require('fs');
const Discord = require('discord.js');
const { token } = require('./config.json');
const { certBannedUserIDs } = require('./certBannedUsers.json');
const { prefix, version, defaultCommandCooldown, adminRoles } = require('./commandVars.json');

const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
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
    if (message.mentions.members != null) {
        if (message.mentions.members.first() == message.guild.members.cache.get("519138795652907030") && !message.author.bot) {
            var pingArray = [
                "735157440898793552",
                "512630813758586888",
                "537572329828384812",
                "527808168521105410",
                "512630936433721355",
                "599360459723898897",
                "599369877333213194",
                "599371053495746564",
                "599360460445450269",
                "599360458696294451",
                "599360460839583834",
                "533262884080320522",
                "527808543210995712",
                "527817056629030923",
                "512630910596939796",
                "538292260811571200",
                "650745721183535154",
                "650750093808631809",
                "541968735544672271",
                "527817056306069517",
                "527817057287405578"
            ];
            message.react(pingArray[Math.floor((Math.random() * 19))]);
        }
    }
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
        return message.reply('<:x:705168468760199178> I can\'t execute that command inside DMs!');
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
        let reply = `<:x:705168468760199178> You didn't provide any arguments, ${message.author}!`;

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
            return message.reply(`<:x:705168468760199178> Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
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

client.on('messageReactionAdd', async (reaction, user) => {
    // #region `Promise failure functions` code
    function failureCallback(error) {
        console.log(error);
    }
    // #endregion

    // #region `Promise success functions` code
    function guildSuccessCallback1(result1) {
        var certifiedRoleId = '537247680930381835';

        if (!result1.roles.cache.get(certifiedRoleId)) {
            result1.roles.add(certifiedRoleId);
            console.log(user.username + " certified themselves");
        } else {
            console.log(user.username + " tried to certify but had done it before");
        }

    }
    // #endregion

    // #region `Reaction detection` code
    if (reaction.message.channel.id === '512180368221274122') {
        if (reaction.message.id !== '641324300128878632') {
            if (reaction.emoji.identifier === "%F0%9F%91%BD") {
                var onBanlist = false;
                for (var i = 0; i < certBannedUserIDs.length; i++) {
                    if (certBannedUserIDs[i] == user.id) {
                        console.log(user.username + " tried to certify but has an ongoing ROC");
                        onBanlist = true;
                    }
                }
                //var modChannel = client.channels.cache.get('550080151040294922');
                //modChannel.send(user.username + " used the alien emoji in <#512180368221274122>");
                if (onBanlist != true) {
                    reaction.message.guild.members.fetch(user.id).then(guildSuccessCallback1, failureCallback);
                }
                reaction.remove();
            }
        }
    }
    // #endregion
});

client.login(token);

// #endregion