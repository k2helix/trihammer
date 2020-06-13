const Discord = require('discord.js')
const Canvas = require('canvas')
const fs = require('fs')
const db = require('megadb')
const bsonDB = require('bsondb')
module.exports = {
	name: 'rankimage',
        description: 'rankimage',
        aliases: ['rank-image'],
	execute(client, message, args) {
    let images = {
      "1": "https://cdn.discordapp.com/attachments/487962590887149603/716052206356529162/images.png",
      "2": "https://cdn.discordapp.com/attachments/487962590887149603/716049978174472233/unknown.png",
      "3": "https://cdn.discordapp.com/attachments/487962590887149603/716052102463356928/2Q.png",
      "4": "https://cdn.discordapp.com/attachments/487962590887149603/716052143399895201/9k.png",
      "5": "https://cdn.discordapp.com/attachments/684154385408065693/715721659486830603/images.png"
  }; 
        let text = args.join(" ")
   if(!images[text]) return message.channel.send('https://trihammerdocs.gitbook.io/trihammer/commands/social-commands/rank-image#images')
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
          f => f.id === message.author.id,
          datosuser => {
            if (!datosuser) {
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
              datosuser.rimage = images[text]
              datosuser.save().catch(error => console.log(error)) 
            }
          });
          message.channel.send("✅")
    }
};