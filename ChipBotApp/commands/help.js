const { prefix, defaultCommandCooldown, adminRoles, version } = require('../commandVars.json');
const Discord = require('discord.js');
const client = new Discord.Client();

module.exports = {
    name: 'help',
    description: 'Retrieves all available commands',
    usage: '<command-name|page-name/number>',
    cooldown: 5,
    commandPages: [
        ['admin', 'Admin Commands List', 'adminOnly', true],
        ['cooldown', 'Commands with Cooldowns List', 'cooldown', undefined],
        ['aliases', 'Commands with Aliases List', 'aliases', undefined]],
    execute(message, args) {
        const data = [];
        const { commands } = message.client;
        var pagesFormatted = [];

        for (var i = 0; i < this.commandPages.length; i++) {
            pagesFormatted.push(this.commandPages[i][0]);
        }

        // #region embed thumbnail grabber
        var iconURL = "";
        if (message.guild === null) {
            iconURL = message.client.user.displayAvatarURL();
        } else {
            iconURL = message.guild.iconURL();
        }
        // #endregion

        // #region conditionalCommandList function
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
                } else if (attributeBoolean === true) {
                    if (commandEval === true) {

                        if (value.usage != null) {
                            embedVariable.addField(prefix + value.name + " " + value.usage + discoveredCooldown, value.description);
                        } else {
                            embedVariable.addField(prefix + value.name + discoveredCooldown, value.description);
                        }

                    }
                } else {
                    if (commandEval !== undefined) {

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
        // #endregion

        // #region "Help" RichEmbed declaration and definition FORLOOP
        let helpEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setThumbnail(iconURL)
            .setTimestamp()
            .setFooter('ChipBot Version ' + version, message.client.user.displayAvatarURL());

        helpEmbed = conditionalCommandList(helpEmbed, "adminOnly", false);

        // Executing the embed based on conditions
        if (!args.length) {
            data.push(`You can send \`${prefix}${this.name} ${this.usage}\` to get info on a specific command!`);

            return message.channel.send(data, helpEmbed, { split: true });
        }
        // #endregion

        // #region Checking existing commands against provided arguments
        const name = args[0].replace(";", "").toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (name) {
            // #region Command List Pagination
            let conditionalEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setThumbnail(iconURL)
                .setTimestamp()
                .setFooter('ChipBot Version ' + version, message.client.user.displayAvatarURL());

            if (name === "pages") {
                return message.channel.send("**Help Pages:** " + pagesFormatted.join(", "));
            }

            for (var i = 0; i < this.commandPages.length; i++) {
                if (name === this.commandPages[i][0]) {
                    conditionalEmbed = conditionalCommandList(conditionalEmbed, this.commandPages[i][2], this.commandPages[i][3], this.commandPages[i][1]);
                    return message.channel.send(conditionalEmbed);
                }
            }
            // #endregion

            // #region Command Args Validation
            if (!command) {
                return message.reply('<:x:705168468760199178> That\'s not a valid command page!');
            } else if (command) {
                // #region "Help ARGUMENT" RichEmbed declaration and definition
                const helpArgumentEmbed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(`\"${command.name}\" Command Specifics`)
                    .setThumbnail(iconURL)
                    .setTimestamp()
                    .setFooter('ChipBot Version ' + version, message.client.user.displayAvatarURL());

                var discoveredCooldownARG = command.cooldown !== undefined ? command.cooldown + " seconds" : undefined;
                var discoveredAliasesARG = command.aliases !== undefined ? command.aliases.join(', ') : undefined;
                var discoveredUsageARG = command.usage !== undefined ? prefix + command.name + " " + command.usage : prefix + command.name;
                var discoveredAdminOnlyARG = command.adminOnly === true || command.adminOnly !== undefined ? "Restricted to **Admins**" : undefined;
                var discoveredPagesARG = command.commandPages !== undefined ? pagesFormatted.join(", ") : undefined;

                if (discoveredAdminOnlyARG) helpArgumentEmbed.addField("Accessibility", discoveredAdminOnlyARG);
                helpArgumentEmbed.addField("Description", command.description);
                helpArgumentEmbed.addField("Usage", discoveredUsageARG);
                if (discoveredCooldownARG) helpArgumentEmbed.addField("Cooldown", discoveredCooldownARG);
                if (discoveredAliasesARG) helpArgumentEmbed.addField(`Aliases`, discoveredAliasesARG);
                if (discoveredPagesARG) helpArgumentEmbed.addField("Pages", discoveredPagesARG);

                message.channel.send(helpArgumentEmbed);
                // #endregion
            }
            // #endregion
        }
        // #endregion
    },
};