
module.exports = {
    name: 'mid',
    usage: '<message-id>',
    adminOnly: true,
    args: true,
    description: 'Throw me a message id, I\'ll repeat the contents',
    execute(message, args) {
        function successCallback(result) {
            message.channel.send(result.author.username + ": " + result.content);
        }

        function failureCallback(error) {
            message.channel.send("<:x:705168468760199178> Invalid Message ID!");
        }

        var reactMessage = message.channel.messages.fetch(args[0]);
        reactMessage.then(successCallback, failureCallback);
    },
};