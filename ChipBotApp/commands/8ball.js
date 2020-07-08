module.exports = {
    name: '8ball',
    usage: '<question>',
    args: true,
    description: 'Decide your fate',
    execute(message, args) {
        var arrayball = [
            'Most likely',
            'My sources say no',
            'Signs point to yes',
            'Don\'t count on it',
            'Ask again later',
            'Outlook not so good',
            'Yes',
            'It is decidedly so',
            'As I see it, yes',
            'My reply is no',
            'You may rely on it',
            'Cannot predict now',
            'Concentrate and ask again',
            'It is certain',
            'Without a doubt',
            'Better not tell you now',
            'Yes definitely',
            'Very doubtful',
            'Outlook good',
            'Reply hazy try again'];
        message.channel.send(arrayball[Math.floor((Math.random() * 20))]);
    },
};