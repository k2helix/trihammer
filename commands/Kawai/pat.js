const Discord = require('discord.js');
module.exports = {
	name: 'pat',
	description: 'Me gusta cuando acaricias mi pelo, siento que podemos conectarnos por el contacto de tu mano y mi pelo',
	execute(client, message, args) {
		let gifs = ['https://cdn.discordapp.com/attachments/487962590887149603/680951868171747407/tumblr_miurofstk31rhyx92o1_500.gif','https://cdn.discordapp.com/attachments/487962590887149603/635898848941834240/rempat.gif'] 
        let autor = message.author
   let user2 = message.mentions.members.first() || message.guild.members.cache.get(args[0])
   let patembed2 = new Discord.MessageEmbed()
   .setTitle(`${autor.username}, yo te acariciaré uwu`)
   .setColor("#0c3bc9")
   .setImage(gifs[Math.floor(Math.random() * gifs.length)])
   
  
   if(!user2) {
   message.channel.send(patembed2)
 }else{
    var patembed1 = new Discord.MessageEmbed()
   .setTitle(`${autor.username} acarició a ${user2.user.username}`)
   .setColor("#0c3bc9")
   .setImage(gifs[Math.floor(Math.random() * gifs.length)])

   message.channel.send(patembed1)

 };
}
}