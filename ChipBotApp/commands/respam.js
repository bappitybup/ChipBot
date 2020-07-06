const { maxDeletions } = require('../commandVars.json');

module.exports = {
    name: 'respam',
    usage: '<messsage-count>',
    adminOnly: true,
    args: true,
    description: 'Throw me a number, I\'ll delete that amount of messages.',
    execute(message, args) {
        var deleteCount = parseInt(args[0]);
        if (!isNaN(deleteCount)) {
            var limited = "";
            deleteCount += 1;
            if (deleteCount-1 > maxDeletions) {
                deleteCount = maxDeletions+1;
                limited = " (Max Limited)";
            }

            if (deleteCount <= 100) {
                message.channel.bulkDelete(deleteCount).then(() => {
                    message.channel.send("<:books:729714657786462349> Deleted " + parseInt(deleteCount-1) + " message(s)."+limited).then(msg => msg.delete({ timeout: 3000 })).catch(function () { console.log("Timeout delete failed") });
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
                            message.channel.send("<:books:729714657786462349> Deleted " + parseInt(deleteCount-1) + " message(s)." + limited).then(msg => msg.delete({ timeout: 3000 })).catch(function () { console.log("Timeout delete failed") });
                        }).catch(function () { console.log("Message deletion failed") });
                        i = i - i;
                    }
                }
            }

        } else {
            message.channel.send('<:x:705168468760199178> You didn\'t specify a number');
        }
    },
};