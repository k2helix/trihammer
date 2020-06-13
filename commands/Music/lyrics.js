const buscador_letra = require("buscador-letra"); //Importar la libreria
const db = require('megadb')
const Discord = require('discord.js')
let buscador = new buscador_letra("Vz78dpprC6a9qr5aNWsPYwTINtjI4vNvg2s1AN24X1ZOW0gKpl8cpmd6k5h_EEo4");
const bsonDB = require('bsondb')
module.exports = {
	name: 'lyrics',
        description: 'lyrics <song>',
        aliases: ['letra', 'lyr'],
	async execute(client, message, args) {
        let nombre = args.join(' ')
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
                    if(!nombre) return message.channel.send('Pon el nombre de la canción.')
                    let resultados = await buscador.buscar(nombre); //Buscar la canción
                    if (resultados.length == 0) return message.channel.send("No se ha encontrado nada");
                    let letra = await buscador.letra(resultados[0]); //Obtener la letra
             
                    let embed = new Discord.MessageEmbed() //Crear el embed
                    .setColor("RANDOM") //Ponerle un color
                    .setTitle(resultados[0].titulo + " de " + resultados[0].artista); //Ponerle un título
             
                    if (letra.length <= 2048) embed.setDescription(letra); //Si la letra cabe en la descripción, ponerla
                    else { //Si no cabe en la descripción...
                        let chunks = letra.match(/[\s\S]{1,1023}/g); //Dividirla en trozos
             
                        for (let chunk of chunks) embed.addField("\u200b", chunk, false); //Agregar la canción en diferentes campos
                    }
                    if (embed.length > 6000) return message.channel.send("La letra es demasiado larga"); //Si el embed supera el tamaño máximo, notificarlo
                   
                    return message.channel.send(embed); //Enviar el embed
                }
                else if(langcode === "en") {
                  if(!nombre) return message.channel.send('Type the name of the song.')
                    let resultados = await buscador.buscar(nombre); //Buscar la canción
                    if (resultados.length == 0) return message.channel.send("Nothing found");
                    let letra = await buscador.letra(resultados[0]); //Obtener la letra
             
                    let embed = new Discord.MessageEmbed() //Crear el embed
                    .setColor("RANDOM") //Ponerle un color
                    .setTitle(resultados[0].titulo + " de " + resultados[0].artista); //Ponerle un título
             
                    if (letra.length <= 2048) embed.setDescription(letra); //Si la letra cabe en la descripción, ponerla
                    else { //Si no cabe en la descripción...
                        let chunks = letra.match(/[\s\S]{1,1023}/g); //Dividirla en trozos
             
                        for (let chunk of chunks) embed.addField("\u200b", chunk, false); //Agregar la canción en diferentes campos
                    }
                    if (embed.length > 6000) return message.channel.send("The lyrics is very long..."); //Si el embed supera el tamaño máximo, notificarlo
                   
                    return message.channel.send(embed);
                }
                }
              });
     
  }
    }

