const Discord = require('discord.js');
const bsonDB = require('bsondb')
const db = require('megadb')

module.exports = {
	name: 'info',
  description: 'info [user]',
  aliases: ['userinfo', 'user'],
	async execute(client, message, args) {
  
let status = {
    "dnd": "<:dnd:663871630488895501> No molestar",
    "idle": "<:idle:663871377539072011> Ausente",
    "online": "<:online:663872345009684481> En línea",
    "offline": "<:offline:663871423189876776> Desconectado"
}; 
    let estatus = {
    "dnd": "<:dnd:663871630488895501> Do not disturb",
    "idle": "<:idle:663871377539072011> Idle",
    "online": "<:online:663872345009684481> Online",
    "offline": "<:offline:663871423189876776> Offline"
}; 
let status2 = {
    "dnd": "<:dnd:663871630488895501>",
    "idle": "<:idle:663871377539072011>",
    "online": "<:online:663872345009684481>",
    "offline": "<:offline:663871423189876776>"
}; 
		let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
    let SchemaGuild = new bsonDB.Schema({
			server: String,
			modrole: String,
			adminrole: String,
			messagelogs: String,
			voicelogs: String,
			actionslogs: String,
			memberlogs: String,
			serverlogs: String,
			infrlogs: String,
			prefix: String,
			lang: String
				})
			let Model = new bsonDB.Model("server", SchemaGuild)
		Model.findOne((f) => f.server === message.guild.id, async (datos1) => { 
			
				  if (!datos1) {
				   return  
				  } else {
          let langcode = datos1.lang
          if(langcode === "es") {
            if(user === message.member && args [0] && args[0] !== user.id) {
              let user = await client.users.fetch(args[0]) 
              let info_embed = new Discord.MessageEmbed()   
              info_embed.setTitle(`Usuario: ${user.tag}`)
              info_embed.setColor("RANDOM")
              info_embed.setThumbnail(user.displayAvatarURL({dynamic: true}))
              
              info_embed.addField(`❯ User ID:`,`${user.id}`, true)
              info_embed.addField(`❯ Creación:`, `${client.convertDate(user.createdTimestamp)}. Hace ${client.T_convertor(Math.floor(Date.now()) - user.createdTimestamp)}`, false)
              message.channel.send(info_embed);
             }
            else {
                 let info_embed = new Discord.MessageEmbed()   
                 info_embed.setTitle(`Usuario: ${user.user.tag}`)
                 info_embed.setColor("RANDOM")
                 info_embed.setThumbnail(user.user.displayAvatarURL({dynamic: true}))
                 
                 info_embed.addField(`❯ User ID:`,`${user.id}`, true)
                 info_embed.addField("❯ Apodo:", `${user.nickname  ? `${user.nickname}` : 'Ninguno'}`, false)
                 info_embed.addField("❯ Status:", `${status[user.user.presence.status]}`, false)
                 info_embed.addField(`❯ Creación:`, `${client.convertDate(user.user.createdTimestamp)}. Hace ${client.T_convertor(Math.floor(Date.now()) - user.user.createdTimestamp)}`, false)
                 info_embed.addField('❯ Entrada:', `${client.convertDate(user.joinedTimestamp)}. Hace ${client.T_convertor(Math.floor(Date.now()) - user.joinedTimestamp)}`, false) 
                 info_embed.addField('❯ Roles:', user.roles.cache.map(r => `${r}`).join(' ') === "@everyone" ? "No tiene roles" : user.roles.cache.sort((b, a) => a.position - b.position || a.id - b.id).map(r => `${r}`).join(' ').replace('@everyone' , ''), false)
                 message.channel.send(info_embed);
            }
              } else if(langcode === "en") {
                if(user === message.member && args [0] && args[0] !== user.id) {
              let user = await client.users.fetch(args[0]) 
              let info_embed = new Discord.MessageEmbed()   
              info_embed.setTitle(`User: ${user.tag}`)
              info_embed.setColor("RANDOM")
              info_embed.setThumbnail(user.displayAvatarURL({dynamic: true}))
              
              info_embed.addField(`❯ User ID:`,`${user.id}`, true)
              info_embed.addField(`❯ Created:`, `${client.econvertDate(user.createdTimestamp)} ~ ${client.eT_convertor(Math.floor(Date.now()) - user.createdTimestamp)} ago`, false)
              message.channel.send(info_embed).catch(err =>  {
                  const key = Math.random().toString(36).substring(2, 15).slice(0, 7)
                 const logs = client.channels.cache.get('640548372574371852')
                  const embed = new Discord.MessageEmbed()
                  .setTitle('Error')
                  .setDescription(err)
                  .setColor('RED')
                  .addField('Código de error', key)
                  .addField('Comando', message.content)
                  .addField('Usuario', message.author.tag + ` (${message.author.id})`)
                  .addField('Servidor', message.guild.name + ` (${message.guild.id})`)
                  logs.send(embed)
                   if(langcode === "es") {
                          message.channel.send(`Ha ocurrido un error, puedes acudir al servidor de soporte (la invitación es EjG6XZs) y pedir ayuda con el código de error ${key}. ${err}`)
                   } else if(langcode === "en") {
                     message.channel.send(`An error ocurred, you can join to the support server (the invite is EjG6XZs) and ask for help with the error code ${key}. ${err}`)
                   }
            
                });
             }
            else {
                 let info_embed = new Discord.MessageEmbed()   
                 info_embed.setTitle(`Usuario: ${user.user.tag}`)
                 info_embed.setColor("RANDOM")
                 info_embed.setThumbnail(user.user.displayAvatarURL({dynamic: true}))
                 
                 info_embed.addField(`❯ User ID:`,`${user.id}`, true)
                 info_embed.addField("❯ Nickname:", `${user.nickname  ? `${user.nickname}` : 'No'}`, false)
                 info_embed.addField("❯ Status:", `${estatus[user.user.presence.status]}`, false)
                 info_embed.addField(`❯ Created:`, `${client.econvertDate(user.user.createdTimestamp)} ~ ${client.eT_convertor(Math.floor(Date.now()) - user.user.createdTimestamp)} ago`, false)
                 info_embed.addField('❯ Joined:', `${client.econvertDate(user.joinedTimestamp)} ~ ${client.eT_convertor(Math.floor(Date.now()) - user.joinedTimestamp)} ago`, false) 
                 info_embed.addField('❯ Roles:', user.roles.cache.map(r => `${r}`).join(' ') === "@everyone" ? "Doesn't have roles" : user.roles.cache.sort((b, a) => a.position - b.position || a.id - b.id).map(r => `${r}`).join(' ').replace('@everyone' , ''), false)
                 message.channel.send(info_embed).catch(err =>  {
                  const key = Math.random().toString(36).substring(2, 15).slice(0, 7)
                 const logs = client.channels.cache.get('640548372574371852')
                  const embed = new Discord.MessageEmbed()
                  .setTitle('Error')
                  .setDescription(err)
                  .setColor('RED')
                  .addField('Código de error', key)
                  .addField('Comando', message.content)
                  .addField('Usuario', message.author.tag + ` (${message.author.id})`)
                  .addField('Servidor', message.guild.name + ` (${message.guild.id})`)
                  logs.send(embed)
                   if(langcode === "es") {
                          message.channel.send(`Ha ocurrido un error, puedes acudir al servidor de soporte (la invitación es EjG6XZs) y pedir ayuda con el código de error ${key}. ${err}`)
                   } else if(langcode === "en") {
                     message.channel.send(`An error ocurred, you can join to the support server (the invite is EjG6XZs) and ask for help with the error code ${key}. ${err}`)
                   }
            
                });
            }
              }
          }
        });
     
  }
};