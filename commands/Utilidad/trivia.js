var timer = {
    running: false,
    iv: 5000,
    timeout: false,
    cb : function(){},
    start : function(cb,iv){
        var elm = this;
        clearInterval(this.timeout);
        this.running = true;
        if(cb) this.cb = cb;
        if(iv) this.iv = iv;
        this.timeout = setTimeout(function(){elm.execute(elm)}, this.iv);
    },
    execute : function(e){
        if(!e.running) return false;
        e.cb();
        e.start();
    },
    stop : function(){
        this.running = false;
    },
    set_interval : function(iv){
        clearInterval(this.timeout);
        this.start(false, iv);
    }
};
const bsonDB = require('bsondb')
const db = require('megadb')
const Discord = require('discord.js')
module.exports = {
	name: 'trivia',
	description: '',
  aliases: ['trivial'],
	execute(client, message, args) {


        if (
          message.author.id === client.config.admin1 ||
          message.author.id === "403195789280673792"
        ) {
          const triviadb = new db.crearDB("triviafinalizado");
          const quiz = require("../../quiz.json");
          let array = [];
          message.channel.send("El evento comienza en 20 segundos...");
          
        
    timer.start(async function(){
      timer.set_interval(16000)
   const arr = [...Array(7).keys()];
            let ct = 0;
            let item = quiz[Math.floor(Math.random() * quiz.length)];
            arr.forEach(async preguntas => {
              if (triviadb.tiene(`${message.guild.id} - ${preguntas}`)) {
                let condicion = await triviadb.obtener(
                  `${message.guild.id} - ${preguntas}`
                );
                if (condicion == true) array.push(preguntas);
              }
            });
            if (triviadb.tiene(`${message.guild.id} - ${item.number}`)) {
              let condicion = await triviadb.obtener(
                `${message.guild.id} - ${item.number}`
              );
              if (condicion == true)
                arr.forEach(number => {
                  if (array.includes(number)) {
                    ct++;
                  }
                });
              if (ct === 6) {
                return message.channel.send("Fin").then(() => {
                  let Schema = new bsonDB.Schema({
                    id: String,
                    server: String,
                    acertadas: Number
                  });
                  let Model = new bsonDB.Model("Quiz", Schema);
    
                  Model.filter(
                    modelo => modelo.server === message.guild.id,
                    async datos => {
                      if (!datos) {
                        console.log("No se encontró nada.");
                        array.forEach(numero => {
                              triviadb.eliminar(`${message.guild.id} - ${numero}`);
                            });
                        timer.stop();
                      } else {
                        datos.sort((a, b) => {
                          return (
                            b.acertadas - a.acertadas || b.acertadas - a.acertadas
                          );
                        });
    
                        let usuarios = [];
                        for (var x in datos.slice(0, 10)) {
                          let user = message.guild.members.cache.has(datos[x].id)
                            ? message.guild.members.cache.get(datos[x].id).user.tag
                            : "Usuario que abandonó el server/n (" + datos[x].id + ")";
                          usuarios.push(
                            `${parseFloat(x) + 1} - ${user}, acertó ${
                              datos[x].acertadas
                            }`
                          );
                        }
                        let embed = new Discord.MessageEmbed()
                          .setTitle("**Clasificación final:**")
                          .setThumbnail(message.guild.iconURL)
                          .setDescription(`${usuarios.join("\n")}`)
                          .setFooter("Evento hosteado por nadie :(");
                        await message.channel
                          .send(embed)
                          .then(() => {
                            array.forEach(numero => {
                              triviadb.eliminar(`${message.guild.id} - ${numero}`);
                            });
                            Model.remove(
                              modelo => modelo.server == message.guild.id,
                              eliminado => {
                                // Si no se encontró nada.
                                if (!eliminado) {
                                  console.log("No se encontró nada para borrar.");
                                  // Si se encontró y se eliminó.
                                }
                              }
                            );
                          timer.stop();
                          })
                          .catch(e => {
                            console.log(e);
                          });
                      }
                    }
                  );
                });
              }
    
              do {
                item = quiz[Math.floor(Math.random() * quiz.length)];
              } while (array.includes(item.number));
              const filter = response => {
                return item.answers.some(
                  answer => answer.toLowerCase() === response.content.toLowerCase()
                );
              };
              message.channel.send(item.question).then(() => {
                message.channel
                  .awaitMessages(filter, { max: 1, time: 15000, errors: ["time"] })
                  .then(collected => {
                    message.channel.send(
                      `¡${collected.first().author} ha acertado!`
                    );
                    triviadb.establecer(
                      `${message.guild.id} - ${item.number}`,
                      true
                    );
                    let Schema = new bsonDB.Schema({
                      id: String,
                      server: String,
                      acertadas: Number
                    });
                    let Model = new bsonDB.Model("Quiz", Schema);
                    Model.findOne(
                      f =>
                        f.id == collected.first().author.id &&
                        f.server == message.guild.id,
                      datos => {
                        if (!datos) {
                          //Creamos un Modelo si no se encontró nada
                          let NuevoModelo = Model.buildModel({
                            id: collected.first().author.id,
                            server: message.guild.id,
                            acertadas: 1
                          });
                          NuevoModelo.save().catch(error => console.log(error)); //Lo guardamos en la base de datos
                        } else {
                          //Si el xp ganado no es suficiente para subir de nivel, solo le aumentamos el xp
                          datos.acertadas = datos.acertadas + 1;
                          datos.save().catch(error => console.log(error)); //Guardamos los cambios en la base de datos
                        }
                      }
                    );
                  timer.set_interval(4000);
                  })
                  .catch(collected => {
                    message.channel.send("Parece que nadie ha acertado...");
                    triviadb.establecer(
                      `${message.guild.id} - ${item.number}`,
                      true
                    );
                  });
              });
            } else {
              const filter = response => {
                return item.answers.some(
                  answer => answer.toLowerCase() === response.content.toLowerCase()
                );
              };
              message.channel.send(item.question).then(() => {
                message.channel
                  .awaitMessages(filter, { max: 1, time: 15000, errors: ["time"] })
                  .then(collected => {
                    message.channel.send(
                      `¡${collected.first().author} ha acertado!`
                    );
                    triviadb.establecer(
                      `${message.guild.id} - ${item.number}`,
                      true
                    );
                    let Schema = new bsonDB.Schema({
                      id: String,
                      server: String,
                      acertadas: Number
                    });
                    let Model = new bsonDB.Model("Quiz", Schema);
                    Model.findOne(
                      f =>
                        f.id == collected.first().author.id &&
                        f.server == message.guild.id,
                      datos => {
                        if (!datos) {
                          //Creamos un Modelo si no se encontró nada
                          let NuevoModelo = Model.buildModel({
                            id: collected.first().author.id,
                            server: message.guild.id,
                            acertadas: 1
                          });
                          NuevoModelo.save().catch(error => console.log(error)); //Lo guardamos en la base de datos
                        } else {
                          //Si el xp ganado no es suficiente para subir de nivel, solo le aumentamos el xp
                          datos.acertadas = datos.acertadas + 1;
                          datos.save().catch(error => console.log(error)); //Guardamos los cambios en la base de datos
                        }
                      }
                    );
                  })
                  .catch(collected => {
                    message.channel.send("Parece que nadie ha acertado...");
                    triviadb.establecer(
                      `${message.guild.id} - ${item.number}`,
                      true
                    );
                    console.log(collected);
                  });
              });
            }
}, 16000);
        }
	}
};