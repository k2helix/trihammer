const db = require('megadb')
const Discord = require('discord.js');
const bsonDB = require('bsondb')
module.exports = {
    name: 'queue',
    description: 'Mira la cola',
    aliases: ['q'],
	async execute(client, message, args) {  
        const serverQueue = client.queue.get(message.guild.id)
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
                  if (!serverQueue) return message.channel.send('No'); 
     const arr = [...Array(serverQueue.songs.length + 1).keys()];
    arr.forEach(number => {
      
    let queue = serverQueue.songs.slice(Number(number.toString() + "0"), Number((number + 1).toString() + "0"))
    let numero = args[0]
    if(!numero) numero = 0

        
      if(number == numero) {
            if(langcode === "es") {
        if(!serverQueue.songs[Number(number.toString() + "0")]) return message.channel.send("No hay nada en esa página de la cola")
        let index = Number(number.toString() + "0");
        let embed = new Discord.MessageEmbed()
        .setTitle("__**Canciones en cola:**__")
        .setColor("RANDOM")
        .setDescription(`${queue.map(song => `**${++index} -** [${song.title}](https://www.youtube.com/watch?v=${song.id}) - ${song.duration}`).join('\n')}\n **Sonando ahora:**\n${serverQueue.songs[0].title} - [${serverQueue.songs[0].duration}](https://www.youtube.com/watch?v=${serverQueue.songs[0].id})`)
        .setFooter(`Página ${number} de ${Math.floor(serverQueue.songs.length / 10)}`)
        message.channel.send(embed).catch(err =>  {
      const key = Math.random().toString(36).substring(2, 15).slice(0, 7)
     const logs = client.channels.cache.get('640548372574371852')
      const embed = new Discord.MessageEmbed()
      .setTitle('Error')
      .setDescription(err)
      .addField('Código de error', key)
      .setColor('RED')
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
        else if(langcode === "en") {

  if(!serverQueue.songs[Number(number.toString() + "0")]) return message.channel.send("There ins't songs in that page of the queue")
  let index = Number(number.toString() + "0");
        let embed = new Discord.MessageEmbed()
        .setTitle("__**Queued Songs:**__")
        .setColor("RANDOM")
        .setDescription(`${queue.map(song => `**${++index} -** [${song.title}](https://www.youtube.com/watch?v=${song.id}) - ${song.duration}`).join('\n')}\n **Now playing**\n${serverQueue.songs[0].title} - [${serverQueue.songs[0].duration}](https://www.youtube.com/watch?v=${serverQueue.songs[0].id})`)
        .setFooter(`Page ${number} of ${Math.floor(serverQueue.songs.length / 10)}`)
        message.channel.send(embed).catch(err =>  {
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
    
        
       
     
    });
                }
              });
    
    
    }
}