const Discord = require('discord.js');
module.exports = {
	name: 'cry',
	description: 'Solo te conoces a ti mismo, ¿!Cuánto sabes del Subaru que yo veo?!',
	execute(client, message, args) {
		
        let autor = message.author
  let cryembed = new Discord.MessageEmbed()
   .setTitle(`${autor.username} está llorando :(`)
   .setColor("#0c3bc9")
   .setImage('https://cdn.discordapp.com/attachments/487962590887149603/635903066310311951/remcrying.gif')
   message.channel.send(cryembed)
 }
}
