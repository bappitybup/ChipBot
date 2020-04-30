module.exports = {
    name: 'args-info',
    description: 'Provides information about arguments passed',
    adminOnly: true,
    args: true,
    usage: '<argument>',
    execute(message, args) {
        if (args[0] === 'foo') {
            return message.channel.send('bar');
        }

        message.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
    },
};