module.exports = {
    name: 'ping',
    usage: '<text>',
    description: 'Throw me one, I\'ll throw you one back',
    execute(message, args) {
        if (!args.length) {
            message.channel.send('Pong');
        } else {
            message.channel.send(args.join(" "));
        }
    },
};