const Discord = require('discord.js')
const Canvas = require('canvas')
const fs = require('fs')
const db = require('megadb')
const bsonDB = require("bsondb");
module.exports = {
	name: 'addlevel',
        description: 'setlevel <user> <level>',
        aliases: ['setlevel'],
	execute(client, message, args) {
    if(!message.member.hasPermission('ADMINISTRATOR')) return
    let user = message.mentions.members.first() ||  message.guild.members.cache.find(m => m.user.tag === args.slice(0, args.length - 1).join(' ')) || message.guild.members.cache.get(args[0])
    let nivel = args[args.length - 1]
    if(!user) return
    if(!nivel) return
    if(isNaN(nivel)) return
    if(nivel.startsWith('-')) return
    let SchemaNivel = new bsonDB.Schema({
            id: String,
            server: String,
            nivel: Number,
            xp: Number
          })
  let NivelModel = new bsonDB.Model("Nivelesrank", SchemaNivel)
   NivelModel.findOne((f) => f.id == user.id && f.server == message.guild.id, async (datos) => {
     if(!datos) {return console.log('no')}
     else {
       datos.nivel = Number(nivel)
      datos.save().catch(error => console.log(error))
       message.channel.send(':white_check_mark:')
     }
   });
    }
};