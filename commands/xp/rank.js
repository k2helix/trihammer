const Discord = require('discord.js')
const Canvas = require('canvas')
const fs = require('fs')
const db = require('megadb')
const bsonDB = require("bsondb");
module.exports = {
	name: 'rank',
	description: 'rank [user]',
	async execute(client, message, args) {
        const applyText = (canvas, text) => {
            const ctx = canvas.getContext('2d');
            let fontSize = 70;
        
            do {
                ctx.font = `${fontSize -= 10}px sans-serif`;
            } while (ctx.measureText(text).width > canvas.width - 300);
        
            return ctx.font;
        };
        
        let SchemaNivel = new bsonDB.Schema({
            id: String,
            server: String,
            nivel: Number,
            xp: Number
          })

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
        if(user.bot) return
        
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
          f => f.id === user.id,
          datosuser => {
            if (!datosuser) {
              let NuevoUserModelo = UserModel.buildModel({
                id: user.id,
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
              let url = datosuser.rimage
              let NivelModel = new bsonDB.Model("Nivelesrank", SchemaNivel)
			   
			   
			  NivelModel.findOne((f) => f.id == user.id && f.server == message.guild.id, async (datos) => {
				if(!datos) { //Creamos un Modelo si no se encontró nada
				  let NuevoModelo = NivelModel.buildModel({
					id: user.id,
					server: message.guild.id,
					nivel: 1,
					xp: 0
                  })
                  NuevoModelo.save().catch(error => console.log(error)) //Lo guardamos en la base de datos
                }
                else {
            NivelModel.filter((modelo) => modelo.server === message.guild.id, async(datos2) => { 
      if (!datos2) {
        return console.log('No se encontró nada.');
      } else {
      
        let posicion = (element) => element.id === user.id && element.server === message.guild.id
                    const xp = datos.xp
                    const nivel = datos.nivel
                    const canvas = Canvas.createCanvas(700, 250);
                    const ctx = canvas.getContext('2d');
            
                    const background = await Canvas.loadImage(url);
                    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                
                    ctx.strokeStyle = '#74037b';
                    ctx.strokeRect(0, 0, canvas.width, canvas.height);
                
                    ctx.font = applyText(canvas, `${user.user.tag}`);
                    ctx.fillStyle = '#ffffff';
                    ctx.fillText(user.user.tag, canvas.width / 2.5, canvas.height / 2);
                
                    ctx.font = '28px sans-serif';
                    ctx.fillStyle = '#ffffff';
                    ctx.fillText(`Level: ${nivel} ~ Top #${datos2.sort((a,b) => { return b.nivel - a.nivel || b.xp - a.xp }).findIndex(posicion) + 1}\nXP: ${xp}/ ${Math.floor(nivel/0.0081654953837673)}`, canvas.width / 2.2, canvas.height / 1.5);
                
                    ctx.beginPath();
                    ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
                    ctx.closePath();
                    ctx.clip();
                
                    const avatar = await Canvas.loadImage(user.user.displayAvatarURL({format: 'png'}));
                    ctx.drawImage(avatar, 25, 25, 200, 200);
                
                    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'rank-image.png');
                    message.channel.send(attachment);
                }
                });
                }
                });
            }
          });

     

				  
        
    }
}