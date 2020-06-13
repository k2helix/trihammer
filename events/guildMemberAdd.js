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

module.exports = async (client, member) => {
    let muteddb = new db.crearDB('muted')
  if(muteddb.has(member.id)) {
    let usuario = await muteddb.get(member.id)
    let Muted = member.guild.roles.cache.find(mute => mute.name.toLowerCase() === "trimuted")
    if(usuario.server[0] === member.guild.id) {
      member.roles.add(Muted)
      muteddb.eliminar(member.id)
    }
    
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
    let Model = new bsonDB.Model("server", SchemaGuild)
  Model.findOne((f) => f.server === member.guild.id, async (datos) => { 
          if (!datos) {
return
          } else {
          
           let langcode = datos.lang
          
           let SchemaW = new bsonDB.Schema({
            server: String,
            canal: String,
            color: String,
            image: String,
            text: String
           });
           let ModelW = new bsonDB.Model("Welcomes", SchemaW)

  ModelW.findOne((f) => f.server === member.guild.id, async (datos2) => { 
   if(!datos2) {
    let logs_channel = member.guild.channels.cache.get(datos.memberlogs)
    if(!logs_channel || logs_channel.type !== "text") return
    if(langcode === "en") {
      logs_channel.send(`<:online:663872345009684481> ${member.user.tag} - ${member.id} has joined the server, created ${client.eT_convertor( Math.floor(Date.now()) - member.user.createdTimestamp)} ago`);
    } else if(langcode === "es") {
      logs_channel.send(`<:online:663872345009684481> ${member.user.tag} - ${member.id} ha entrado al servidor, creado hace ${client.T_convertor(Math.floor(Date.now()) - member.user.createdTimestamp)}`);
    }
   }
  else {
      let canal = datos2.canal
      let welcomechannel = member.guild.channels.cache.get(canal)
      let logs_channel = member.guild.channels.cache.get(datos.memberlogs)
            let text = datos2.text

  const canvas = Canvas.createCanvas(1638, 888);
    const context = canvas.getContext('2d')
  const ctx = canvas.getContext("2d");
  const background = await Canvas.loadImage(datos2.image);
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#74037b";
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  ctx.font = "80px sans-serif";
  ctx.fillStyle = "#e91e63";
  ctx.fillText(
    member.user.username + ",",
    canvas.width / 10,
    canvas.height / 1.8
  );


    context.font = "60px sans-serif"
    context.fillStyle = datos2.color
wrapText(canvas.getContext('2d'), text, 140, 610, 1400, 65)
    
  ctx.beginPath();
  ctx.arc(800, 200, 175, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();

  const avatar = await Canvas.loadImage(member.user.displayAvatarURL({format: 'png'}));
  ctx.drawImage(avatar, 625, 25, 350, 350);

  const attachment = new Discord.MessageAttachment(
    canvas.toBuffer(),
    "welcome-image.png"
  );

  if(logs_channel && welcomechannel) {
    welcomechannel.send(attachment)
    if(langcode === "en") {
      logs_channel.send(`<:online:663872345009684481> ${member.user.tag} - ${member.id} has joined the server, created ${client.eT_convertor( Math.floor(Date.now()) - member.user.createdTimestamp)} ago`);
    } else if(langcode === "es") {
      logs_channel.send(`<:online:663872345009684481> ${member.user.tag} - ${member.id} ha entrado al servidor, creado hace ${client.T_convertor(Math.floor(Date.now()) - member.user.createdTimestamp)}`);
    }
  }

  else if(welcomechannel && !logs_channel) {
    welcomechannel.send(attachment)
  }
  
}
  });
  
          }
        });
}