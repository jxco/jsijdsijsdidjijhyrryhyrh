const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
 console.log("welcome bot"); 
console.log("log");
});

client.on("message", (message) => {
    
    if (isCommand(message, "tk")) {
        const reason = message.content.split(" ").slice(1).join(" ");
        if (!message.guild.roles.exists("name", "♕STAFF♕")) return message.channel.send(`This server doesn't have a \`Support Team\` role made, so the ticket won't be opened.\nIf you are an administrator, make one with that name exactly and give it to users that should be able to see tickets.`);
        if (message.guild.channels.exists("name", "ticket-" + message.author.id)) return message.channel.send(`You already have a ticket open.`);
        message.guild.createChannel(`ticket-${message.author.id}`, "text").then(c => {
            let role = message.guild.roles.find("name", "♕STAFF♕");
            let role2 = message.guild.roles.find("name", "@everyone");
            c.overwritePermissions(role, {
                SEND_MESSAGES: true,
                READ_MESSAGES: true
            });
            c.overwritePermissions(role2, {
                SEND_MESSAGES: false,
                READ_MESSAGES: false
            });
            c.overwritePermissions(message.author, {
                SEND_MESSAGES: true,
                READ_MESSAGES: true
            });
            message.channel.send(`:white_check_mark: Your ticket has been created, #${c.name}.`);
            const embed = new Discord.RichEmbed()
                .setColor(0xCF40FA)
                .addField(`Hey ${message.author.username}!`, `Please try explain why you opened this ticket with as much detail as possible. Our **Support Staff** will be here soon to help.`)
                .setTimestamp();
            c.send({
                embed: embed
            });
        }).catch(console.error); 
    }


    if (isCommand(message, "close")) {
        if (!message.channel.name.startsWith(`ticket-`)) return message.channel.send(`You can't use the close command outside of a ticket channel.`);

        message.channel.send(`Are you sure? Once confirmed, you cannot reverse this action!\nTo confirm, type \`c\`. This will time out in 10 seconds and be cancelled.`)
            .then((m) => {
                message.channel.awaitMessages(response => response.content === 'c', {
                        max: 1,
                        time: 10000,
                        errors: ['time'],
                    })
                    .then((collected) => {
                        message.channel.delete();
                    })
                    .catch(() => {
                        m.edit('Ticket close timed out, the ticket was not closed.').then(m2 => {
                            m2.delete();
                        }, 3000);
                    });
            });
    }

});

isCommand=(message, input)=>{
var args = message.content.slice(length).trim().split(/ +/g),
command = args.shift().toLowerCase();
if(command == input) return true;
else return false;
}

client.login(process.env.BOT_TOKEN); 
