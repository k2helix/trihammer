
const Discord = require("discord.js");
const fs = require("fs");
const moment = require("moment");

const Canvas = require("canvas");
const ytdl = require("ytdl-core");
const ffmpeg = require("ffmpeg");
const GOOGLE_API_KEY = "AIzaSyBjF8ySUjU8aY6jUBIvxmDNV8TUAga1rPI";
const YouTube = require("simple-youtube-api");
const youtube = new YouTube(GOOGLE_API_KEY);
const db = require("megadb");
const bsonDB = require("bsondb");
const spam = require('spamnya')

var guild = {};
module.exports = async (client, message) => {
 
  
    client.MakeRole = (message, name, color, perms) => {
        return message.guild.roles.create({data: {
          name: name,
          color: color,
          permissions: perms == false ? [] : perms
        }, reason: 'I need a role to mute people.'
        
        });
      };
      (client.SetChannelperms = (message, role, permissions) => {
        message.guild.channels.cache.array().forEach(async channel => {
          if (channel.type == "voice") {
            await channel.replacePermissionOverwrites({
              overwrites: permissions.voice
            });
          } else {
            await channel.replacePermissionOverwrites({
              overwrites: permissions.text
            });
          }
        });
      }),
        (client.Convert = date => {
          let valid_keys = {
            y: { nombre: "año(s)", tiempo: 31104000000 },
            t: { nombre: "mes(es)", tiempo: 2592000000 },
            w: { nombre: "semana(s)", tiempo: 604800000 },
            d: { nombre: "día(s)", tiempo: 86400000 },
            h: { nombre: "hora(s)", tiempo: 3600000 },
            m: { nombre: "minuto(s)", tiempo: 60000 },
            s: { nombre: "segundo(s)", tiempo: 1000 }
          };
          if (!date) return;
          let format = date.slice(-1),
            time = date.slice(0, -1);
    
          if (!valid_keys[format]) return false;
          if (isNaN(time)) return false;
          if (parseInt(time) <= 0) return false;
          return {
            nombre: `${parseInt(time)} ${valid_keys[format].nombre}`,
            tiempo: valid_keys[format].tiempo * parseInt(time)
          };
        });
      client.eConvert = date => {
        let valid_keys = {
          y: { nombre: "year(s)", tiempo: 31104000000 },
          t: { nombre: "month(es)", tiempo: 2592000000 },
          w: { nombre: "week(s)", tiempo: 604800000 },
          d: { nombre: "day(s)", tiempo: 86400000 },
          h: { nombre: "hour(s)", tiempo: 3600000 },
          m: { nombre: "minute(s)", tiempo: 60000 },
          s: { nombre: "second(s)", tiempo: 1000 }
        };
        if (!date) return;
        let format = date.slice(-1),
          time = date.slice(0, -1);
    
        if (!valid_keys[format]) return false;
        if (isNaN(time)) return false;
        if (parseInt(time) <= 0) return false;
        return {
          nombre: `${parseInt(time)} ${valid_keys[format].nombre}`,
          tiempo: valid_keys[format].tiempo * parseInt(time)
        };
      };
      if (message.author.bot) return;
    
      if (message.channel.type == "dm") {
        let canal = client.channels.cache.get("640548372574371852");
        canal.send(
          `Mensaje de ${message.author.tag} recibido: \n \`${message.content}\``
        );
        return;
      }
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
    let ModelGuild = new bsonDB.Model("server", SchemaGuild)

    ModelGuild.findOne((f) => f.server === message.guild.id, async (datos) => { 
        if (!datos) {
           let NuevoModelo = ModelGuild.buildModel({
              server: message.guild.id,
              modrole: 'none',
              adminrole: 'none',
              messagelogs: 'none',
              voicelogs: 'none',
              actionslogs: 'none',
              memberlogs: 'none',
              serverlogs: 'none',
              infrlogs: 'none',
              prefix: 't-',
              lang: 'en'
          })
     NuevoModelo.save().catch(error => console.log(error))
    } else {
      let langcode = datos.lang
      let prefix = datos.prefix
      
      spam.log(message, 50)
      if(spam.tooQuick(10, 15000)){
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
              let permiso = datos1.modrole !== 'none' ? message.member.roles.cache.has(datos1.modrole) : message.member.hasPermission('MANAGE_MESSAGES')
              if(permiso) return
              let logs_channel = message.guild.channels.cache.get(datos1.infrlogs)
              const qdb = require("quick.db");
              let truedb = new db.crearDB('antispam')
              if(!truedb.has(message.guild.id)) return
              let tf = await truedb.obtener(message.guild.id)
              if(tf === true) {
                const mutesDB = new qdb.table('mutefinalmenteacabado')

              let mutedR = message.guild.roles.cache.find(r => r.name.toLowerCase() == "trimuted");
                if(!mutedR) return
                if(message.member.roles.cache.has(mutedR.id)) return
              if(!mutedR) return

             
          let key = Math.random().toString(36).substring(2, 15).slice(0, 6)
          let Schema = new bsonDB.Schema({
                key: String,
                id: String,
                server: String,
                tipo: String,
                duration: String,
                time: String,
                mod: String,
                reason: String
                    })
                   let Model = new bsonDB.Model('Infracciones', Schema)
                 
              message.member.roles.add(mutedR.id).then(() => {
                let NuevoGModelo = Model.buildModel({
                  key: key,
                  id: message.author.id,
                  server: message.guild.id,
                  tipo: 'mute',
                  duration: "1h",
                  time: `${Date.now()}`,
                  mod: 'AntiSpam System',
                  reason: 'Spam Detected'
                        })
                   NuevoGModelo.save().catch(error => console.log(error)) 
                    let expiration = Date.now() + 3600000;
              mutesDB.set(`${key}`, {
                expirationDate: expiration,
                user: message.author.id,
                server: message.guild.id,
                key: key,
                notified: false
              });
              if(langcode === "es") {
                message.channel.send(`${message.author.tag}, has sido muteado por spamear`)
                const embed5 = new Discord.MessageEmbed()
                .setTitle('Moderación: Mutes')
                .setColor("RANDOM")
                .setDescription(`⚠ Has sido muteado en ${message.guild.name}`)
                .addField('Razón:', `Spam Detected`)
                .addField('Tiempo:', `Fuiste muteado durante una hora`)
                .setFooter(`Fuiste muteado por: el sistema antispam`) 
               message.author.send(embed5).catch(error => {
                 console.log(error)
               })
               if(!logs_channel || logs_channel.type !== 'text') return
               logs_channel.send(`El usuario ${message.author.tag} ha sido muteado por detección de spam.`)
              } else if(langcode === "en") {
                message.channel.send(`${message.author.tag}, you have been muted for spamming.`)
                const embed5 = new Discord.MessageEmbed()
                .setTitle('Moderation: Mutes')
                .setColor("RANDOM")
                .setDescription(`⚠ You have been muted in ${message.guild.name}`)
                .addField('Reason:', `Spam Detected`)
                .addField('Time:', `You have been muted one hour`)
                .setFooter(`You have been muted by: Antispam system`) 
               message.author.send(embed5).catch(error => {
                 console.log(error)
               })
               if(!logs_channel || logs_channel.type !== 'text') return
               logs_channel.send(`${message.author.tag} has been warned for spam detection.`)
              }
              });
              
              }
              }
            });
         
        
        }
        setTimeout(async () => {
          if (message.author.bot) return;
          let SchemaUser = new bsonDB.Schema({
            id: String,
            globalxp: Number,
            pimage: String,
            rimage: String,
            pdesc: String,
            ptext: String,
            rep: Number,
            cooldown: Number,
            repcooldown: Number
                })

          let UserModel = new bsonDB.Model("UserTest", SchemaUser);
  
          UserModel.findOne(
            f => f.id == message.author.id,
            datosuser => {
              if (!datosuser) {
                //Creamos un Modelo si no se encontró nada
                let NuevoUserModelo = UserModel.buildModel({
                  id: message.author.id,
                  globalxp: 0,
                  pimage: "https://cdn.discordapp.com/attachments/487962590887149603/695967471932538915/Z.png",
                  rimage: 'https://github.com/discordjs/guide/blob/master/code-samples/popular-topics/canvas/12/wallpaper.jpg?raw=true',
                  pdesc: '',
                  ptext: 'Bla bla bla...',
                  rep: 0,
                  cooldown: Date.now(),
                  repcooldown: Date.now()
                })
           NuevoUserModelo.save().catch(error => console.log(error)) 
              
                //Lo guardamos en la base de datos
              } else {
                //Si el xp ganado no es suficiente para subir de nivel, solo le aumentamos el xp
                let time = datosuser.cooldown
                if (Math.floor(Date.now() - time < 120000)) {
                  return;
                } else {
                  let SchemaGlobalXP = new bsonDB.Schema({
                    id: String,
                    globalxp: Number,
                    pimage: String,
                    rimage: String,
                    pdesc: String,
                    ptext: String,
                    rep: Number,
                    cooldown: Number,
                    repcooldown: Number
                        })
    
                  //Creamos la base de datos y inicializamos su schema (SchemaNivel)
                  let GlobalXPModel = new bsonDB.Model("UserTest", SchemaGlobalXP);
                  let SchemaNivel = new bsonDB.Schema({
                    id: String,
                    server: String,
                    nivel: Number,
                    xp: Number
                  });
                  //Creamos la base de datos y inicializamos su schema (SchemaNivel)
                  let NivelModel = new bsonDB.Model("Nivelesrank", SchemaNivel);
          
                  let randomxp = Math.floor(Math.random() * 11) + 10;
                  GlobalXPModel.findOne(
                    f => f.id == message.author.id,
                    datos1 => {
                      if (!datos1) {
                        let NuevoModelo = GlobalXPModel.buildModel({
                          id: message.author.id,
                          globalxp: randomxp,
                          pimage: "https://cdn.discordapp.com/attachments/487962590887149603/695967471932538915/Z.png",
                          rimage: 'https://github.com/discordjs/guide/blob/master/code-samples/popular-topics/canvas/12/wallpaper.jpg?raw=true',
                          pdesc: '',
                          ptext: 'Bla bla bla...',
                          rep: 0,
                          cooldown: Date.now(),
                          repcooldown: Date.now()
                        })
                   NuevoModelo.save().catch(error => console.log(error)) 
                      
                        //Lo guardamos en la base de datos
                      } else {
                        //Si el xp ganado no es suficiente para subir de nivel, solo le aumentamos el xp
                        datos1.globalxp = Number(datos1.globalxp) + Number(randomxp)
                        datos1.cooldown = Number(Date.now())
                        datos1.save().catch(error => console.log(error)); //Guardamos los cambios en la base de datos
                      }
                    }
                  );
          
                  NivelModel.findOne(
                    f => f.id == message.author.id && f.server == message.guild.id,
                    datos => {
                      if (!datos) {
                        //Creamos un Modelo si no se encontró nada
                        let NuevoModelo = NivelModel.buildModel({
                          id: message.author.id,
                          server: message.guild.id,
                          nivel: 1,
                          xp: randomxp
                        });
                        NuevoModelo.save().catch(error => console.log(error)); //Lo guardamos en la base de datos
                      } else {
                        //Si se encontró
                        const leveldb = new db.crearDB("levels");
          
                        if (
                          datos.xp + randomxp >=
                          Math.floor(datos.nivel / 0.0081654953837673)
                        ) {
                          //Le subimos +1 nivel
                          datos.nivel = datos.nivel + 1; //Le damos +1 a su nivel
                          datos.xp = 0; //Actualizamos su xp a 0
                          datos.save().then(nuevo_dato => {
                               const arr = [...Array(Math.floor(nuevo_dato.nivel + 1)).keys()];
                          
                            arr.forEach(async num => {
                              if (leveldb.tiene(`${num}.${message.guild.id}`)) {
                                const rol = await leveldb.obtener(
                                  `${num}.${message.guild.id}`
                                );
                                let role = message.guild.roles.cache.get(rol[0]);
                                if(!role) return
                                if(message.member.roles.cache.has(role.id)) return
                                message.member.roles.add(role);
                  
                               
                                if (langcode === "es") {
                                  message.channel.send(
                                    `¡Enhorabuena <@${message.author.id}>, has conseguido el rol **${role.name}**! :tada:`
                                  );
                                } else if (langcode === "en") {
                                  message.channel.send(
                                    `¡Congratulations <@${message.author.id}>, you have reached the role **${role.name}**! :tada:`
                                  );
                                }
                              }
                              });
                          }); //Guardamos los cambios en la base de datos
                            
                              
                        } else {
                          //Si el xp ganado no es suficiente para subir de nivel, solo le aumentamos el xp
                          datos.xp = datos.xp + randomxp;
                          
                          const arr = [...Array(Math.floor(datos.nivel + 1)).keys()];
                          
                            arr.forEach(async num => {
                              if (leveldb.tiene(`${num}.${message.guild.id}`)) {
                          
                                const rol = await leveldb.obtener(
                                  `${num}.${message.guild.id}`
                                );
                                
                                let role = message.guild.roles.cache.get(rol[0]);
                                
                                if (!role) return
                                if(message.member.roles.cache.has(role.id)) return
                                message.member.roles.add(role);
                  
                                if (langcode === "es") {
                                  message.channel.send(
                                    `¡Enhorabuena <@${message.author.id}>, has conseguido el rol **${role.name}**! :tada:`
                                  );
                                } else if (langcode === "en") {
                                  message.channel.send(
                                    `¡Congratulations <@${message.author.id}>, you have reached the role **${role.name}**! :tada:`
                                  );
                                }
                              }
                            });
                          datos.save().catch(error => console.log(error)); //Guardamos los cambios en la base de datos
                        }
                      }
                    }
                  );
                  datosuser.cooldown = Date.now()
                }
              }
            }
          );
      
           
        
        }, 10000);
        client.play = async (guild, song) => {
          const serverQueue = client.queue.get(guild.id);
          
          if (!song) {
            serverQueue.voiceChannel.leave();
            client.queue.delete(guild.id);
            return;
          }
          console.log(serverQueue.songs);
          client.dispatcher = serverQueue.connection
            .play(ytdl(song.url))
            client.dispatcher.once("finish", reason => {
              if (reason === "Stream is not generating quickly enough.")
                console.log("Song ended.");
              else console.log(reason);
              if (serverQueue.loop === true)
                serverQueue.songs.push(serverQueue.songs.shift());
              else serverQueue.songs.shift();
      
              client.play(guild, serverQueue.songs[0]);
            })
            .on("error", error => console.error(error));
          client.dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

      let SchemaVote = new bsonDB.Schema({
            id: String,
            server: String,
            song: String
                })
            let Model = new bsonDB.Model("Votos", SchemaVote)
          Model.remove((modelo) => modelo.server === message.guild.id && modelo.song === serverQueue.songs[0].id, (eliminado) => {
        // Si no se encontró nada.
        if (!eliminado) {
          console.log('No se encontró nada para borrar.');
        // Si se encontró y se eliminó.
        } else {
         console.log('Eliminada de la base de datos')
        }
      })
         
         ModelGuild.findOne((f) => f.server === serverQueue.textChannel.guild.id, (datos) => {
           let lang = datos.lang
           if (lang === "es") {
            var embed = new Discord.MessageEmbed()
              .setTitle("🎶 **Sonando** 🎶")
              .setDescription(`[${song.title}](${song.url})`)
              .setColor("RANDOM")
              .addField("Canal:", song.channel, true)
              .addField("Duración:", song.duration, true)
              .setThumbnail(`https://img.youtube.com/vi/${song.id}/hqdefault.jpg`);
            return serverQueue.textChannel.send(embed);
          } else if (lang === "en") {
            var embed = new Discord.MessageEmbed()
              .setTitle("🎶 **Now playing** 🎶")
              .setDescription(`[${song.title}](${song.url})`)
              .setColor("RANDOM")
              .addField("Channel:", song.channel, true)
              .addField("Duration:", song.duration, true)
              .setThumbnail(`https://img.youtube.com/vi/${song.id}/hqdefault.jpg`);
            return serverQueue.textChannel.send(embed);
          }
         })
          
        };
      
        client.handleVideo = async (
          video,
          message,
          voiceChannel,
          playlist = false
        ) => {
          const serverQueue = client.queue.get(message.guild.id);
          let string = "";
          for (let t of Object.values(video.duration)) {
            if (!t) continue;
            if (t < 10) t = "0" + t;
            string = string + `:${t}`;
          }
      
          console.log(video);
          const song = {
            id: video.id,
            title: video.title,
            duration: string.slice(1),
            durationObject: video.duration,
            channel: video.channel.title,
            url: `https://www.youtube.com/watch?v=${video.id}`
          };
          if (!serverQueue) {
            const queueConstruct = {
              textChannel: message.channel,
              voiceChannel: voiceChannel,
              connection: null,
              songs: [],
              volume: 5,
              playing: true
            };
            client.queue.set(message.guild.id, queueConstruct);
      
            queueConstruct.songs.push(song);
      
            try {
              var connection = await voiceChannel.join();
              queueConstruct.connection = connection;
              client.play(message.guild, queueConstruct.songs[0]);
            } catch (error) {
              console.error(`I could not join the voice channel: ${error}`);
              client.queue.delete(message.guild.id);
              return message.channel.send(`Error: ${error}`);
            }
          } else {
            serverQueue.songs.push(song);
            console.log(serverQueue.songs);
            if (playlist) return;
            else
            
            if (langcode === "es") {
              var embed = new Discord.MessageEmbed()
                .setTitle("**__Añadido a la cola__**")
                .setDescription(
                  `[${song.title}](${song.url}) ha sido añadido a la cola con éxito`
                )
                .addField("Canal:", song.channel, true)
                .addField("Duración:", song.duration, true)
                .setThumbnail(`https://img.youtube.com/vi/${song.id}/hqdefault.jpg`);
              return serverQueue.textChannel.send(embed);
            } else if (langcode === "en") {
              var embed = new Discord.MessageEmbed()
                .setTitle("**__Added to queue__**")
                .setDescription(
                  `[${song.title}](${song.url}) has been succesfully added to queue`
                )
                .addField("Channel:", song.channel, true)
                .addField("Duration:", song.duration, true)
                .setThumbnail(`https://img.youtube.com/vi/${song.id}/hqdefault.jpg`);
              return serverQueue.textChannel.send(embed);
            }
          }
          return;
        };
        if (message.mentions.users.has(client.user.id)) {
        if(langcode === "es") {
          message.channel.send(
            `Mi prefijo es \`${prefix}\`, si necesitas ayuda usa \`${prefix}help\``
          );
        } else if(langcode === "en") {
          message.channel.send(
            `My prefix is \`${prefix}\`, if you need help use \`${prefix}help\``
          );
        }
      } 
      if (!message.content.startsWith(prefix) || message.author.bot) return;

      const args = message.content.slice(prefix.length).split(/ +/);
      const commandName = args.shift().toLowerCase();

    
    
      const command =
        client.commands.get(commandName) ||
        client.commands.find(
          cmd => cmd.aliases && cmd.aliases.includes(commandName)
        );
    
      if (!command) return;
     if (message.content === prefix + command.name + " help") {
          return message.channel.send(command.description);
        }
      try {
        command.execute(client, message, args)
        setTimeout(() => {
          let logschannel = datos.actionslogs
          if(!logschannel) return
      let logs_channel = message.guild.channels.cache.get(logschannel);
        if(!logs_channel || logs_channel.type!== 'text') return
          if(langcode === "es") {
            logs_channel.send(`:wrench: ${message.author.tag} ha usado el comando **${command.name}** en <#${message.channel.id}>`)
          } else if(langcode === "en") {
            logs_channel.send(`:wrench: ${message.author.tag} has used the command **${command.name}** in <#${message.channel.id}>`)
          }
        }, 1000);
        
      } catch (error) {
       console.log(error)
          const key = Math.random().toString(36).substring(2, 15).slice(0, 7)
         const logs = client.channels.cache.get('640548372574371852')
          const embed = new Discord.MessageEmbed()
          .setTitle('Error')
          .setDescription(error)
          .setColor('RED')
          .addField('Código de error', key)
          .addField('Comando', message.content)
          .addField('Usuario', message.author.tag + ` (${message.author.id})`)
          .addField('Servidor', message.guild.name + ` (${message.guild.id})`)
          logs.send(embed)
           if(langcode === "es") {
                  message.channel.send(`Ha ocurrido un error, puedes acudir al servidor de soporte (la invitación es EjG6XZs) y pedir ayuda con el código de error ${key}. ${error}`)
           } else if(langcode === "en") {
             message.channel.send(`An error ocurred, you can join to the support server (the invite is EjG6XZs) and ask for help with the error code ${key}. ${error}`)
           }
          }
    }
    }); 
   
  
      if (message.content.toLowerCase().includes("feo")) {
        message.react("618038981942050826");
      }
      if (message.content.toLowerCase().includes("fbi")) {
    if (message.guild.id !== "603833979996602391") return;
        message.channel.send("FBI OPEN UP!!!!!!!!", {
          files: [
            {
              attachment:
                "https://media1.tenor.com/images/e683152889dc703c77ce5bada1e89705/tenor.gif?itemid=11500735",
              name: "fbi" + ".gif"
            }
          ]
        });
      }
    
      if (message.content.toLowerCase().includes("papelera")) {
        if (message.guild.id !== "603833979996602391") return;
        message.channel.send(
          "esto es una papelera japoniense no es nada especial pero es japoniense la gente tira cosas no tienen sentimientos pobre papelera acuérdate de ella",
          {
            files: [
              {
                attachment: "https://i.imgur.com/mgNoaIl.png",
                name: "papelera" + ".png"
              }
            ]
          }
        );
        return;
      }
      if (message.content.toLowerCase().includes("puta")) {
    if (message.guild.id !== "603833979996602391") return;
        message.channel.send({
          files: [
            {
              attachment:
                "https://cdn.discordapp.com/attachments/487962590887149603/673603357545332758/sketch-1580669947883.png",
              name: "puta.png"
            }
          ]
        });
      }
      if (message.content.toLowerCase().includes("g2")) {
    if (message.guild.id !== "603833979996602391") return;
        message.channel.send("G2 está mamadísimo", {
          files: [
            {
              attachment:
                "https://cdn.discordapp.com/attachments/418590211803578391/612048235728732161/Goga-ganado-Rainbow-Six-Siege_1219688028_133861_1440x600.png",
              name: "G2mamadisimo" + ".png"
            }
          ]
        });
        return;
      }
    
      if (message.content.toLowerCase().includes("puto")) {
    if (message.guild.id !== "603833979996602391") return;
        message.react("613320778301308938");
        if (message.guild.id === "619711295578570752") return;
        {
          message.channel.send({
            files: [
              {
                attachment: "https://i.imgur.com/9Pvl5bA.png",
                name: "puto" + ".png"
              }
            ]
          });
        }
      }
      
      
    

    

    

    
      if (message.content === "t-join") {
        if (!message.member.hasPermission("MANAGE_GUILD")) return;
    
        client.emit("guildMemberAdd", message.guild.members.cache.get('408785106942164992'));
      }
       if (message.content === "t-leave") {
        if (!message.member.hasPermission("MANAGE_GUILD")) return;
    
        client.emit("guildMemberRemove", message.guild.members.cache.get('408785106942164992'));
      }
      

      
    

 }