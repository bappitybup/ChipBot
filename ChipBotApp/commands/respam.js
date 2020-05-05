const { maxDeletions } = require('../commandVars.json');

module.exports = {
    name: 'respam',
    usage: '<messsage-count>',
    adminOnly: true,
    description: 'Throw me a number, I\'ll count backwards.',
    execute(message, args) {
        var deleteCount = parseInt(args[0]);
        if (!args.length) {
            message.channel.send('You didn\'t specify a number');
        } else {
            if (!isNaN(deleteCount)) {
                var limited = "";
                if (deleteCount > maxDeletions) {
                    deleteCount = maxDeletions;
                    limited = " (Max Limited)";
                }

                if (deleteCount <= 100) {
                    message.channel.bulkDelete(deleteCount).then(() => {
                        message.channel.send("Deleted " + deleteCount + " messages."+limited).then(msg => msg.delete({ timeout: 3000 })).catch(function () { console.log("Timeout delete failed") });
                    }).catch(function () { console.log("Message deletion failed") });
                } else {
                    var i = deleteCount;
                    while (i > 0) {
                        minusedVal = i - 100;
                        if (!minusedVal <= 0) {
                            message.channel.bulkDelete(100).catch(function () { console.log("Old messages cannot be deleted") });;
                            i = i - 100;
                        } else {
                            message.channel.bulkDelete(i).catch(function () { console.log("Old messages cannot be deleted") }).then(() => {
                                message.channel.send("Deleted " + deleteCount + " messages." + limited).then(msg => msg.delete({ timeout: 3000 })).catch(function () { console.log("Timeout delete failed") });
                            }).catch(function () { console.log("Message deletion failed") });
                            i = i - i;
                        }
                    }
                }

            } else {
                message.channel.send('You didn\'t specify a number');
            }
        }
    },
};