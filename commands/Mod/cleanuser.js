const db = require('megadb')
const Discord = require('discord.js')
const bsonDB = require('bsondb')
module.exports = {
	name: 'cleanuser',
        description: 'cleanuser <user> [amount]',
        aliases: ['userclean', 'clean'],
	async execute(client, message, args) {
        const user = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
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
                  let permiso = datos1.modrole !== 'none' ? message.member.roles.cache.has(datos1.modrole) : message.member.hasPermission('MANAGE_MESSAGES')
                 let adminperms = datos1.adminrole !== 'none' ? message.member.roles.cache.has(datos1.adminrole) : message.member.hasPermission('MANAGE_MESSAGES')
             if(!permiso &&  !adminperms) return
                 let langcode = datos1.lang
                 var amount = args[1]
                 if (!amount) amount = "100"
                      if(langcode === "es") {
                 if(!user) return message.channel.send('Tienes que especificar de quién son los mensajes que quieres borrar');
                 // Fetch 100 messages (will be filtered and lowered up to max amount requested)
                 message.channel.messages.fetch({
                 limit: 100,
                 }).then((messages) => {
                 
                 const filterBy = user ? user.id : client.user.id;
                 messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount);
                 
                 message.channel.bulkDelete(messages).catch(error => console.log(error.stack)).catch(err =>  {
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
                 }); 
                 message.delete()
                 }
                     else if(langcode === "en") {
                       if(!user) return message.channel.send('You need to specify whose are the messages');
                 // Fetch 100 messages (will be filtered and lowered up to max amount requested)
                 message.channel.messages.fetch({
                 limit: 100,
                 }).then((messages) => {
                 
                 const filterBy = user ? user.id : client.user.id;
                 messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount);
                 
                 message.channel.bulkDelete(messages).catch(err =>  {
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
                 }); 
                 message.delete()
                     }
                }
              });


  }
	}

