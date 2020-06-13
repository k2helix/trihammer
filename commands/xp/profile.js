const Discord = require('discord.js')
const Canvas = require('canvas')
const fs = require('fs')
const db = require('megadb')
const bsonDB = require("bsondb");
function wrapText(context , text, x, y, maxWidth, lineHeight) {
        var words = text.split(' ');
        var line = '';

        for(var n = 0; n < words.length; n++) {
          var testLine = line + words[n] + ' ';
          var metrics = context.measureText(testLine);
          var testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
          }
          else {
            line = testLine;
          }
        }
        context.fillText(line, x, y);
      }

module.exports = {
	name: 'profile',
	description: 'profile [user]',
	async execute(client, message, args) {



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
          datos => {
            if (!datos) {
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
              UserModel.filter((modelo) => modelo.globalxp >= 0, async(datos2) => { 
                if (!datos2) {
                  return console.log('No se encontró nada.');
                } else {
                
                  let posicion = (element) => element.id === user.id
                    const xp = datos.globalxp
                    const canvas = Canvas.createCanvas(442, 330);
                    var context = canvas.getContext('2d');
                      const ctx = canvas.getContext('2d');
              
                      const background = await Canvas.loadImage(datos.pimage);
                      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                      const fondo = await Canvas.loadImage("https://cdn.discordapp.com/attachments/487962590887149603/716060007577419876/capas.png");
                      ctx.globalAlpha = 0.75
                      ctx.drawImage(fondo, 0, 0, canvas.width, canvas.height);
                  
                      ctx.strokeStyle = '#74037b';
                      ctx.strokeRect(0, 0, canvas.width, canvas.height);
                  
                      ctx.font = user.user.tag.length < 12 ? '30px sans-serif' : '20px sans-serif'
                      ctx.fillStyle = '#0e0d0e'; 
                      ctx.fillText(user.user.tag, 130, 90);
          
                      ctx.font = '17px sans-serif';
                      ctx.fillStyle = '#0e0d0e';
                      ctx.fillText(datos.pdesc, 135, 120);
                  
                      ctx.font = '24px sans-serif';
                      ctx.fillStyle = '#0e0d0e';
                      ctx.fillText('|\n|\n|\n|\n|', 130, 180);
                  
                      ctx.font = '24px sans-serif';
                      ctx.fillStyle = '#0e0d0e';
                      ctx.fillText(`Total XP\n${xp}\nTop ${(datos2.sort((a,b) => { return b.nivel - a.nivel || b.globalxp - a.globalxp }).findIndex(posicion) + 1).toString().length != 1 ? "\n" : ""}#${datos2.sort((a,b) => { return b.nivel - a.nivel || b.globalxp - a.globalxp }).findIndex(posicion) + 1}`, 32, 180);
          
                      ctx.font = '20px sans-serif';
                      ctx.fillStyle = '#ff0007';
                      ctx.fillText(`+${datos.rep}rep`, canvas.width / 17, 295);
          
          context.fillStyle = '#0e0d0e'
          context.font = '22px sans-serif'
          wrapText(canvas.getContext('2d'), datos.ptext, 140, 170, 275, 20)
                  
                    
                      const avatar = await Canvas.loadImage(user.user.displayAvatarURL({format: 'png'}));
                      ctx.drawImage(avatar, 27, 52, 100, 100);
                      
                  
                      const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'profile-image.png');
                      message.channel.send(attachment);
                }
                  });
                    }
          });

          
        
    }
}