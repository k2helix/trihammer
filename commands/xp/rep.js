const Discord = require('discord.js')
const Canvas = require('canvas')
const fs = require('fs')
const db = require('megadb')
const moment = require('moment')
const bsonDB = require('bsondb')
function Ti_convertor (ms) {      
  let años = Math.floor((ms) / (1000 * 60 * 60 * 24 * 365));
  let meses = Math.floor(((ms) % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
  let dias = Math.floor(((ms) % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
  let horas = Math.floor(((ms) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutos = Math.floor(((ms) % (1000 * 60 * 60)) / (1000 * 60));
  let segundos = Math.floor(((ms) % (1000 * 60)) / 1000);



  let final1 = ""
  if(años > 0) final1 += años > 1 ? `${años} años, ` : `${años} año, `
  if(meses > 0) final1 += meses > 1 ? `${meses} meses y ` : `${meses} mes y `
  if(dias > 0) final1 += dias > 1 ? `${dias} días. ` : `${dias} día. `
  if(dias < 1 && horas > 0) final1 += horas > 1 ? `${horas} horas, ` : `${horas} hora, `
  if(dias < 1 && minutos > 0) final1 += minutos > 1 ? `${minutos} minutos y ` : `${minutos} minuto y `
  if(dias < 1 && segundos >= 0) final1 += segundos > 1 ? `${segundos} segundos` : `${segundos} segundo`
  return final1 
}

function eTi_convertor (ms) {      
  let años = Math.floor((ms) / (1000 * 60 * 60 * 24 * 365));
  let meses = Math.floor(((ms) % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
  let dias = Math.floor(((ms) % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
  let horas = Math.floor(((ms) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutos = Math.floor(((ms) % (1000 * 60 * 60)) / (1000 * 60));
  let segundos = Math.floor(((ms) % (1000 * 60)) / 1000);



  let final1 = ""
  if(años > 0) final1 += años > 1 ? `${años} years, ` : `${años} year, `
  if(meses > 0) final1 += meses > 1 ? `${meses} months and ` : `${meses} month and `
  if(dias > 0) final1 += dias > 1 ? `${dias} days. ` : `${dias} day. `
  if(dias < 1 && horas > 0) final1 += horas > 1 ? `${horas} hours, ` : `${horas} hour, `
  if(dias < 1 && minutos > 0) final1 += minutos > 1 ? `${minutos} minutes and ` : `${minutos} minute and `
  if(dias < 1 && segundos >= 0) final1 += segundos > 1 ? `${segundos} seconds` : `${segundos} second`
  return final1 
}

module.exports = {
	name: 'rep',
        description: 'rep <user>',
	async execute(client, message, args) {

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
     async (datos) => {
        if (!datos) {
          let NuevoUserModelo2 = UserModel.buildModel({
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
     NuevoUserModelo2.save().catch(error => console.log(error)) 
          //Lo guardamos en la base de datos
        } else {  
      if(datos.repcooldown > Date.now()) return message.channel.send(`You need to wait ${eTi_convertor(datos.repcooldown - Date.now())} to give rep.`)
      datos.repcooldown = Date.now() + 43200000
      datos.save().catch(error => console.log(error))
      let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) 
      if(!user) return
      UserModel.findOne(
        f => f.id === user.id,
       async (datosuser) => {
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
        datosuser.rep = datosuser.rep + 1
        datosuser.save().catch(error => console.log(error))
        message.channel.send(`**${message.author.username}** gave one reputation point to **${user.user.username}**`)
  
          }
   
        });
      
        }
      });
   
}
}