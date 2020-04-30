const { prefix, defaultCommandCooldown, adminRoles, version } = require('../commandVars.json');
const Discord = require('discord.js');
const client = new Discord.Client();

module.exports = {
    name: 'help',
    description: 'Retrieves all available commands',
    aliases: ['commands'],
    usage: '<command-name>',
    cooldown: 5,
    execute(message, args) {
        const data = [];
        const { commands } = message.client;

        var iconURL = "";

        if (message.guild === null) {
            iconURL = message.client.user.displayAvatarURL();
        } else {
            iconURL = message.guild.iconURL();
        }

        // "Help" RichEmbed declaration and definition
        const helpEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Available Commands')
            .setThumbnail(iconURL)
            .setTimestamp()
            .setFooter('ChipBot Version ' + version, message.client.user.displayAvatarURL());

        // Looping through existing commands and adding to "Help" RichEmbed
        commands.forEach(function (value, key) {

            var discoveredCooldown = value.cooldown !== undefined ? " *(" + value.cooldown + "s cooldown)*" : "";
            var discoveredAdminOnly = value.adminOnly === true || value.adminOnly !== undefined ? " ***(Admins only)***" : "";
            var commandAccess = true;
            if (value.adminOnly === true) {
                for (i = 0; i < adminRoles.length; i++) {
                    if (!message.member.roles.cache.some(role => role.name === adminRoles[i])) {
                        commandAccess = false;
                    } else {
                        commandAccess = true;
                        break;
                    }
                }

                if (commandAccess === true) {
                    if (value.usage != null) {
                        helpEmbed.addField(prefix + value.name + " " + value.usage + discoveredCooldown + discoveredAdminOnly, value.description);
                    } else {
                        helpEmbed.addField(prefix + value.name + discoveredCooldown + discoveredAdminOnly, value.description);
                    }
                }

            } else {
                if (value.usage != null) {
                    helpEmbed.addField(prefix + value.name + " " + value.usage + discoveredCooldown + discoveredAdminOnly, value.description);
                } else {
                    helpEmbed.addField(prefix + value.name + discoveredCooldown + discoveredAdminOnly, value.description);
                }
            }

        });

        // Executing the embed based on conditions
        if (!args.length) {
            data.push(`You can send \`${prefix}help <command-name>\` to get info on a specific command!`);

            return message.channel.send(data, helpEmbed, { split: true });
        }

        // Checking existing commands against provided arguments
        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply('that\'s not a valid command!');
        }

        // "Help ARGUMENT" RichEmbed declaration and definition
        const helpArgumentEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`\"${command.name}\" Command Specifics`)
            .setThumbnail(iconURL)
            .setTimestamp()
            .setFooter('ChipBot Version ' + version, message.client.user.displayAvatarURL());

        var discoveredCooldownARG = command.cooldown !== undefined ? command.cooldown+" seconds" : defaultCommandCooldown+" seconds (unset)";
        var discoveredAliasesARG = command.aliases !== undefined ? command.aliases.join(', ') : "N/A";
        var discoveredUsageARG = command.usage !== undefined ? prefix+command.name+" "+command.usage : prefix+command.name;
        var discoveredAdminOnlyARG = command.adminOnly === true || command.adminOnly !== undefined ? "Restricted to **Admins**" : "Available for **All Users**";

        helpArgumentEmbed.addField("Accessibility", discoveredAdminOnlyARG);

        helpArgumentEmbed.addField("Description", command.description);

        helpArgumentEmbed.addField("Usage", discoveredUsageARG);

        helpArgumentEmbed.addField(`Aliases`, discoveredAliasesARG);

        helpArgumentEmbed.addField("Cooldown", discoveredCooldownARG);

        message.channel.send(helpArgumentEmbed);
    },
};