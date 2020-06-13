const db = require('megadb')
const bsonDB = require('bsondb')
module.exports = {
	name: 'queueremove',
	description: 'Borra una canción de la cola',
	aliases: ['qremove', 'songremove', 'remove', 'deletesong'],
async	execute(client, message, args) {

		
		const serverQueue = client.queue.get(message.guild.id)
		const voiceChannel = message.member.voice.channel;
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
                if (!voiceChannel) return message.channel.send('No estás en un canal de voz');
                if (!serverQueue) return message.channel.send('No hay nada en la cola ahora mismo');
               if(!args[0]) return message.channel.send("Pon un número para borrarlo de la cola")
                if(isNaN(args[0])) {return message.channel.send("Debe ser un número.")}
                else{
                  console.log(Math.floor((args[0]) - 1))
                if(args[0] === "1") return message.channel.send("No puedes borrar la canción que está sonando")
                  let existe = serverQueue.songs[Math.floor((args[0]) - 1)] ? true : false
                  console.log(existe)
                  if(existe === true) {
                    message.channel.send(`${serverQueue.songs[Math.floor((args[0]) - 1)].title} ha sido removido de la cola.`)
                delete(serverQueue.songs[Math.floor((args[0]) - 1)])
                console.log ("Delete queue command has been used.")
                 const arr = [...Array(100).keys()];
            arr.forEach(number => {
              if(!serverQueue.songs[number]) return
              if(number < args[0] - 1) return
              serverQueue.songs[number - 1] = serverQueue.songs[number]
              
            })
              serverQueue.songs = serverQueue.songs.slice(0, serverQueue.songs.length - 1)
                }
                  else {message.channel.send("La cola no tiene ninguna canción con ese número")}
                }
              } else if(langcode === "en") {
                if (!voiceChannel) return message.channel.send('You are not in a voice channel');
                if (!serverQueue) return message.channel.send('Nothing playing now.');
               if(!args[0]) return message.channel.send("Type a number to delete it from the queue")
                if(isNaN(args[0])) {return message.channel.send("It must be a number")}
                else{
                  console.log(Math.floor((args[0]) - 1))
                if(args[0] === "1") return message.channel.send("You can't delete the current playing song")
                  let existe = serverQueue.songs[Math.floor((args[0]) - 1)] ? true : false
                  if(existe === true) {
                    message.channel.send(`${serverQueue.songs[Math.floor((args[0]) - 1)].title} has been succesfully removed from the queue.`)
                delete(serverQueue.songs[Math.floor((args[0]) - 1)])
                console.log ("Delete queue command has been used.")
                    const arr = [...Array(100).keys()];
            arr.forEach(number => {
              if(!serverQueue.songs[number]) return
              if(number < args[0] - 1) return
              serverQueue.songs[number - 1] = serverQueue.songs[number]
            })
                serverQueue.songs = serverQueue.songs.slice(0, serverQueue.songs.length - 1)
                }
                  else {message.channel.send("The queue doesn't have a song with that number.")}
                }
              }
            }
          });
    
}
};
