const { prefix, defaultCommandCooldown, adminRoles, version } = require('../commandVars.json');
const Discord = require('discord.js');
const client = new Discord.Client();

module.exports = {
    name: 'help',
    description: 'Retrieves all available commands',
    aliases: ['commands'],
    usage: '<command-name|page-name/number>',
    cooldown: 5,
    execute(message, args) {
        const data = [];
        const { commands } = message.client;

        function conditionalCommandList(embedVariable, commandAttribute, attributeBoolean, embedTitle = "Commands List") {
            embedVariable.setTitle(embedTitle);
            commands.forEach(function (value, key) {
                var commandEval = eval("value." + commandAttribute);
                
                var discoveredCooldown = value.cooldown !== undefined ? " *(" + value.cooldown + "s cooldown)*" : "";
                if (attributeBoolean === false) {
                    if (commandEval !== true) {
                        if (value.usage != null) {
                            embedVariable.addField(prefix + value.name + " " + value.usage + discoveredCooldown, value.description);
                        } else {
                            embedVariable.addField(prefix + value.name + discoveredCooldown, value.description);
                        }

                    }
                } else {
                    if (commandEval === true) {

                        if (value.usage != null) {
                            embedVariable.addField(prefix + value.name + " " + value.usage + discoveredCooldown, value.description);
                        } else {
                            embedVariable.addField(prefix + value.name + discoveredCooldown, value.description);
                        }

                    }
                }

            });
            return embedVariable;
        }

        var iconURL = "";
        if (message.guild === null) {
            iconURL = message.client.user.displayAvatarURL();
        } else {
            iconURL = message.guild.iconURL();
        }

        // #region "Help" RichEmbed declaration and definition FORLOOP
        let helpEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setThumbnail(iconURL)
            .setTimestamp()
            .setFooter('ChipBot Version ' + version, message.client.user.displayAvatarURL());

        helpEmbed = conditionalCommandList(helpEmbed, "adminOnly", false);

        // Executing the embed based on conditions
        if (!args.length) {
            data.push(`You can send \`${prefix}help <command-name>\` to get info on a specific command!`);

            return message.channel.send(data, helpEmbed, { split: true });
        }
        // #endregion

        // Checking existing commands against provided arguments
        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (name) {


            // #region Command List Pagination
            if (name === "admin") {
                let conditionalEmbed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setThumbnail(iconURL)
                    .setTimestamp()
                    .setFooter('ChipBot Version ' + version, message.client.user.displayAvatarURL());

                conditionalEmbed = conditionalCommandList(conditionalEmbed, "adminOnly", true, "Admin Commands List");

                return message.channel.send(conditionalEmbed);
            }
            // #endregion

            // #region Command Args Validation
            if (!command) {
                return message.reply('that\'s not a valid command!');
            } else if (command) {
                // #region "Help ARGUMENT" RichEmbed declaration and definition
                const helpArgumentEmbed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(`\"${command.name}\" Command Specifics`)
                    .setThumbnail(iconURL)
                    .setTimestamp()
                    .setFooter('ChipBot Version ' + version, message.client.user.displayAvatarURL());

                var discoveredCooldownARG = command.cooldown !== undefined ? command.cooldown + " seconds" : defaultCommandCooldown + " seconds (unset)";
                var discoveredAliasesARG = command.aliases !== undefined ? command.aliases.join(', ') : "N/A";
                var discoveredUsageARG = command.usage !== undefined ? prefix + command.name + " " + command.usage : prefix + command.name;
                var discoveredAdminOnlyARG = command.adminOnly === true || command.adminOnly !== undefined ? "Restricted to **Admins**" : "Available for **All Users**";

                helpArgumentEmbed.addField("Accessibility", discoveredAdminOnlyARG);
                helpArgumentEmbed.addField("Description", command.description);
                helpArgumentEmbed.addField("Usage", discoveredUsageARG);
                helpArgumentEmbed.addField(`Aliases`, discoveredAliasesARG);
                helpArgumentEmbed.addField("Cooldown", discoveredCooldownARG);

                message.channel.send(helpArgumentEmbed);
                // #endregion
            }
            // #endregion
        }
    },
};