const Discord = require('discord.js');
module.exports = {
	name: 'hug',
	description: 'Rem, -¿sí?',
	execute(client, message, args) {
		
        let autor = message.author
        let user2 = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        let hugembed2 = new Discord.MessageEmbed()
         .setTitle(`${autor.username} yo te abrazo uwu`)
         .setColor("#0c3bc9")
         .setImage('https://cdn.discordapp.com/attachments/487962590887149603/635903667479904257/remhugging.gif')
         if(!user2) {
          message.channel.send(hugembed2)
        }else{
           var hugembed1 = new Discord.MessageEmbed()
          .setTitle(`${autor.username} abraza a ${user2.user.username}`)
          .setColor("#0c3bc9")
          .setImage('https://cdn.discordapp.com/attachments/487962590887149603/635903667479904257/remhugging.gif')
       
          message.channel.send(hugembed1)
       
        };
       }
    }