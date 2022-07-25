const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');
const client = new Discord.Client();
const prefix = '!';

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/roleees/').filter(file => file.endsWith('.js'));

for(const file of commandFiles){
    const command = require(`./commands/roleees/${file}`);
    client.commands.set(command.name, command);
}

function handleMessage(msg, command, message, args){
    if(command === msg){
        client.commands.get(msg).execute(message, args, Discord, client);
    }
}

client.once('ready', () => {
    console.log('The Shop Just Launched!');
});

client.on('message',message => {
    if(message.author.bot)
        return;
    if(!message.member.user.points){
        message.member.user.points = 0;
    }
    message.member.user.points++;
    let balsPath = "./bals.json";
    let balsString = fs.readFileSync(balsPath);
    let bals = JSON.parse(balsString);
    let done = false;
    let index = -1;
    for(i = 0; i < bals.data.length; i++){
        if(message.member.user.username == bals.data[i].name){
            index = i;
        }
    }
    if(index<0){
        bals.data.push({name: message.member.user.username, bal:0});
        index = bals.length - 1;
        fs.writeFileSync(balsPath, JSON.stringify(bals, null, 2));
    }
    if(message.member.user.points > 30){
        for(let i = 0; i < bals.data.length; i++){
            if(bals.data[i].name == message.member.user.username && !message.author.bot){
                bals.data[i].bal += 10;
                const embed = new Discord.MessageEmbed()
                .setTitle(message.member.user.username + " just got 10 coins for chatting")
                .setColor("0A0AFF");
                message.channel.send(embed);
                done = true;
                break;
            }
            if(message.author.bot)
                done = true;
        }
        message.member.user.points = 0;
        fs.writeFileSync(balsPath, JSON.stringify(bals, null, 2));
    }
    if(!message.content.startsWith(prefix)) return;
    
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    handleMessage('help', command, message, args);
    handleMessage('info', command, message, args);
    handleMessage('bal', command, message, args);
    handleMessage('shop', command, message, args);
    handleMessage('buy', command, message, args);
    handleMessage('amiadmin', command, message, args);
    handleMessage('collect', command, message, args);
    handleMessage('leaderboard', command, message, args);
    handleMessage('add', command, message, args);
    handleMessage('remove', command, message, args);

});
client.login('OTc5NjUwMDkwOTMzMjk3MTYy.GIKSDj.nsHvdfiQTSztpt7nnKNUp_sturAnVvAtOgR-3g');