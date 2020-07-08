module.exports = {
    name: 'cr',
    adminOnly: true,
    args: true,
    usage: '<#channel> <message-id> <emoji>',
    description: 'Your reactions are my own',
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

        var reactionID = args[2];
        if (new RegExp("<:.*?:[0-9]{18}>").test(args[2])) {
            reactionID = args[2].match(new RegExp("^.*\:([0-9]{18})>"))
            reactionID = reactionID[1];
        }

        function reactMessageSuccess(result1) {
            if (args.length >= 3) {
                if (channel !== undefined) {
                    if (result1 !== undefined) {
                        result1.react(reactionID);
                    }

                }
            }
        }

        function reactMessageFailure(error) {
            console.log(error);
        }

        if (channel !== undefined) {
            channel.messages.fetch(args[1]).then(reactMessageSuccess, reactMessageFailure);
        }
        message.delete();
    },
};