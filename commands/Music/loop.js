const db = require("megadb")
const bsonDB = require('bsondb')
module.exports = {
	name: 'loop',
        description: 'Pon la cola en loop',
        aliases: ['l'],
	async execute(client, message, args) {
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
              const serverQueue = client.queue.get(message.guild.id)
     if(langcode === "es") {
        if (!message.member.voice.channel) return message.channel.send('No estás en un canal de voz');
        if(!serverQueue) return message.channel.send('No hay nada en la cola ahora mismo');
        serverQueue.loop = !serverQueue.loop;
        client.queue.set(message.guild.id, serverQueue);
      if(serverQueue.loop) message.channel.send('**🔁 Loop activado**');
      else return message.channel.send('**🔁 Loop desactivado**');
    }
    else if(langcode === "en"){
      if (!message.member.voice.channel) return message.channel.send('You are not in a voice channel');
        if(!serverQueue) return message.channel.send('The queue is empty');
        serverQueue.loop = !serverQueue.loop;
        client.queue.set(message.guild.id, serverQueue);
      if(serverQueue.loop) message.channel.send('**🔁 Loop enabled**');
      else return message.channel.send('**🔁 Loop disabled**');
    }
            }
            });
        
  }
};