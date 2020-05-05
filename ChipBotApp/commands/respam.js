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
                message.channel.bulkDelete(deleteCount).then(() => {
                    message.channel.send("Deleted "+args[0]+" messages.").then(msg => msg.delete({ timeout: 3000 })).catch(function () { console.log("Timeout delete failed")});
                }).catch(function () {console.log("Promise Rejected")});
            } else {
                message.channel.send('You didn\'t specify a number');
            }
        }
    },
};