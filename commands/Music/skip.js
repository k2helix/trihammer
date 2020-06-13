const db = require('megadb')
const bsonDB = require('bsondb')
const ytdl = require ('ytdl-core')
module.exports = {
	name: 'skip',
	description: 'Salta una canción',
	aliases: ['skip'],
	async execute(client, message) {
        
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
                  if(langcode === "es") {
                    if (!message.member.voice.channel) return message.channel.send('No estás en un canal de voz');
                    if (!serverQueue) return message.channel.send('No hay nada para saltar ahora mismo.');
                       let miembros = message.member.voice.channel.members.filter(m => !m.user.bot).size
                    if(message.member.hasPermission('MANAGE_MESSAGES')) {
                      return serverQueue.connection.client.dispatcher.end() 
                    }
                    if(miembros === 1 || miembros === 2 || miembros === 3){
                      serverQueue.connection.client.dispatcher.end()
                    } else {
                              let SchemaVote = new bsonDB.Schema({
                      id: String,
                      server: String,
                      song: String
                          })
                      let Model = new bsonDB.Model("Votos", SchemaVote)
                  Model.filter((modelo) => modelo.song === serverQueue.songs[0].id && modelo.server === message.guild.id, async (datos) => { 
                            if (!datos) {
                               let NuevoGModelo = Model.buildModel({
                        id: message.author.id,
                        server: message.guild.id,
                        song: serverQueue.songs[0].id
                              })
                         NuevoGModelo.save().then(data => {
                           message.channel.send(`¿Saltando? 1/${Math.floor(miembros/2)}`)
                         }).catch(error => console.log(error))   
                            } else {
                       if(datos.some(dato => dato.id === message.author.id)) {
                         return message.channel.send(`¿Saltando? ${datos.length}/${Math.floor(miembros/2)}`)
                       } else {
                         let NuevoModelo = Model.buildModel({
                        id: message.author.id,
                        server: message.guild.id,
                        song: serverQueue.songs[0].id
                              })
                         NuevoModelo.save().then(data => {
                         if(datos.length + 1 >= Math.floor(miembros/2)) {
                                let cancion = serverQueue.songs[0].id
                                Model.remove((modelo) => modelo.server === message.guild.id && modelo.song === cancion, (eliminado) => {
                  // Si no se encontró nada.
                  if (!eliminado) {
                    console.log('No se encontró nada para borrar.');
                  // Si se encontró y se eliminó.
                  } else {
                    message.channel.send("Todos los miembros necesarios han votado, saltando...")
                    serverQueue.connection.client.dispatcher.end()
                  }
                })
                              } else {
                                 message.channel.send(`¿Saltando? ${datos.length + 1}/${Math.floor(miembros/2)}`)
                              }
                        
                }).catch(error => console.log(error))
                       }           
                               
                              
                            }
                          });
                    }
                } else if(langcode === "en") {
                    if (!message.member.voice.channel) return message.channel.send('You are not in a voice channel');
                    if (!serverQueue) return message.channel.send('Nothing to skip rigth now');
                       let miembros = message.member.voice.channel.members.filter(m => !m.user.bot).size
                
                    if(miembros === 1 || miembros === 2 || miembros === 3){
                      serverQueue.connection.client.dispatcher.end()
                    } else {
                              let SchemaVote = new bsonDB.Schema({
                      id: String,
                      server: String,
                      song: String
                          })
                      let Model = new bsonDB.Model("Votos", SchemaVote)
                  Model.filter((modelo) => modelo.song === serverQueue.songs[0].id && modelo.server === message.guild.id, async (datos) => { 
                            if (!datos) {
                               let NuevoGModelo = Model.buildModel({
                        id: message.author.id,
                        server: message.guild.id,
                        song: serverQueue.songs[0].id
                              })
                         NuevoGModelo.save().then(data => {
                           message.channel.send(`Skipping? 1/${Math.floor(miembros/2)}`)
                         }).catch(error => console.log(error))   
                            } else {
                       if(datos.some(dato => dato.id === message.author.id)) {
                         return message.channel.send(`Skipping? ${datos.length}/${Math.floor(miembros/2)}`)
                       } else {
                         let NuevoModelo = Model.buildModel({
                        id: message.author.id,
                        server: message.guild.id,
                        song: serverQueue.songs[0].id
                              })
                         NuevoModelo.save().then(() => {
                           if(datos.length +1 >= Math.floor(miembros/2)) {
                                let cancion = serverQueue.songs[0].id
                                Model.remove((modelo) => modelo.server === message.guild.id && modelo.song === cancion, (eliminado) => {
                  // Si no se encontró nada.
                  if (!eliminado) {
                    console.log('No se encontró nada para borrar.');
                  // Si se encontró y se eliminó.
                  } else {
                    message.channel.send("All necessary members have voted, skipping...")
                    serverQueue.connection.client.dispatcher.end()
                  }
                })
                              } else {
                                 message.channel.send(`Skipping? ${datos.length + 1}/${Math.floor(miembros/2)}`)
                              }
                        
                }).catch(error => console.log(error))
                       }         
                               
                              
                            }
                          });
                    }
                  }
                }
              });
     
}
}
