module.exports = {
    name: 'cc',
    adminOnly: true,
    args: true,
    usage: '<#channel> <text>',
    description: 'Your words are my own',
    execute(message, args) {
        var channel = undefined;
        if (args[0].includes("#")) {
            var channelRegex = new RegExp("\<\#[0-9]{18}\>");
            if (channelRegex.test(args[0])) {
                var fixedID = args[0].replace("<#", "");
                fixedID = fixedID.replace(">", "");
                channel = message.guild.channels.cache.get(fixedID);
            } else {
                channel = message.guild.channels.cache.find(c => c.name.includes(args[0].replace('#', '')));
            }
        }

        if (args.length >= 2) {
            if (channel !== undefined) {
                var mainargs = args;
                mainargs.splice(0, 1);
                mainargs = mainargs.join(" ");
                channel.startTyping(); 
                setTimeout(function () { channel.send(args.join(" ")) }, 1000);
                channel.stopTyping();

            } else {
                message.channel.startTyping(); 
                setTimeout(function () { message.channel.send(args.join(" ")) }, 1000);
                message.channel.stopTyping();
            }
        } else {
            message.channel.startTyping();
            setTimeout(function () { message.channel.send(args.join(" ")) }, 3000);
            message.channel.stopTyping();
        }
        message.delete();
    },
};