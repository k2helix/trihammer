const Discord = require('discord.js')
const Canvas = require('canvas')
const fs = require('fs')
const db = require('megadb')
const bsonDB = require('bsondb')
module.exports = {
	name: 'profimage',
        description: 'profile-text <text>',
        aliases: ['profile-image', 'profileimage'],
	execute(client, message, args) {
    let images = {
      "1": "https://cdn.discordapp.com/attachments/487962590887149603/716052349851795496/images.png",
      "2": "https://cdn.discordapp.com/attachments/487962590887149603/716052326154108980/images.png",
      "3": "https://cdn.discordapp.com/attachments/487962590887149603/716052302389313676/images.png",
      "4": "https://cdn.discordapp.com/attachments/487962590887149603/716052163025174588/2Q.png",
      "5": "https://cdn.discordapp.com/attachments/487962590887149603/716049978174472233/unknown.png",
      "6": "https://cdn.discordapp.com/attachments/487962590887149603/716052072981856256/abstract-background-3036235_960_720.png",
      "7": "https://cdn.discordapp.com/attachments/588140412036841482/715736357892390982/heart-5209050_1920.jpg",
      "8": "https://cdn.discordapp.com/attachments/588140412036841482/715736559126708294/ferris-wheel-5228823_1280.png",
      "9": "https://cdn.discordapp.com/attachments/588140412036841482/715736136227749942/hall-5215746_1920.jpg",
      "10": "https://cdn.discordapp.com/attachments/588140412036841482/715735767481319474/animal-1845263_1920.jpg",
      "11": "https://cdn.discordapp.com/attachments/588140412036841482/715735868434022460/rabbit-542554_1920.jpg"
  }; 
        let text = args.join(" ")
   if(!images[text]) return message.channel.send('https://trihammerdocs.gitbook.io/trihammer/commands/social-commands/profile-image#images')
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
              datosuser.pimage = images[text]
              datosuser.save().catch(error => console.log(error)) 
            }
          });
          message.channel.send("✅")
    }
};