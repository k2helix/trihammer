const Discord = require('discord.js');
module.exports = {
	name: 'smile',
	description: '¡Sonríe, Rem!',
	execute(client, message, args) {
		
        let autor = message.author
        let user2 = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        let smileembed2 = new Discord.MessageEmbed()
         .setTitle(`${autor.username} sonríe :)`)
         .setColor("#0c3bc9")
         .setImage('https://cdn.discordapp.com/attachments/487962590887149603/635902384442310714/remsmile.gif')
         if(!user2) {
          message.channel.send(smileembed2)
        }else{
           var smileembed1 = new Discord.MessageEmbed()
          .setTitle(`${autor.username} le sonríe a ${user2.user.username}`)
          .setColor("#0c3bc9")
          .setImage('https://cdn.discordapp.com/attachments/487962590887149603/635902384442310714/remsmile.gif')
       
          message.channel.send(smileembed1)
       
        };
       }
}