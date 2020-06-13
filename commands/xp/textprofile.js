const Discord = require('discord.js')
const Canvas = require('canvas')
const fs = require('fs')
const db = require('megadb')
const bsonDB = require('bsondb')
module.exports = {
	name: 'textprofile',
        description: 'profile-text <text>',
        aliases: ['proftext', 'textprof', 'profile-text'],
	execute(client, message, args) {
        let text = args.join(" ")
        if(!text) return
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
              datosuser.ptext = text
              datosuser.save().catch(error => console.log(error)) 
            }
          });
          message.channel.send("✅")
    }
};