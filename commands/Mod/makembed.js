const Discord = require('discord.js');
const fs = require('fs');
const bsonDB = require('bsondb')



  
    
    function sendEmbed(message) {
        let command = message.content;
        let channel = message.channel;
        let author = message.author;
    
        // get title string coordinates in command
        let titleStart = command.indexOf('[');
        let titleEnd = command.indexOf(']');
        let title = command.substr(titleStart + 1, titleEnd - titleStart - 1);
    
        // get description string coordinates in command
        // -> (start after +1 so we don't count '[' or ']' twice)
        let descStart = command.indexOf('[', titleStart + 1);
        let descEnd = command.indexOf(']', titleEnd + 1);
        let description = command.substr(descStart + 1, descEnd - descStart - 1);

        let footerStart = command.indexOf('[', descStart + 1);
        let footerEnd = command.indexOf(']', descEnd + 1);
        let footer = command.substr(footerStart + 1, footerEnd - footerStart - 1);
    
        let thumbnailStart = command.indexOf('(', footerStart + 1);
        let thumbnailEnd = command.indexOf(')', footerEnd + 1);
        let thumbnail = command.substr(thumbnailStart + 1, thumbnailEnd - thumbnailStart - 1);
    
        let imageStart = command.indexOf('[', thumbnailStart + 1);
        let imageEnd = command.indexOf(']', thumbnailEnd + 1);
        let image = command.substr(imageStart + 1, imageEnd - imageStart - 1);

    
        let field1Start = command.indexOf('{', descStart + 1);
        let field1End = command.indexOf('}', descEnd + 1);
        let field1 = command.substr(field1Start + 1, field1End - field1Start - 1);
    
        let field1textStart = command.indexOf('(', field1Start + 1);
        let field1textEnd = command.indexOf(')', field1End + 1);
        let field1text = command.substr(field1textStart + 1, field1textEnd - field1textStart - 1);
    
        let field2Start = command.indexOf('{', field1textStart + 1);
        let field2End = command.indexOf('}', field1textEnd + 1);
        let field2 = command.substr(field2Start + 1, field2End - field2Start - 1);
    
        let field2textStart = command.indexOf('(', field2Start + 1);
        let field2textEnd = command.indexOf(')', field2End + 1);
        let field2text = command.substr(field2textStart + 1, field2textEnd - field2textStart - 1);
    
        let field3Start = command.indexOf('{', field2textStart + 1);
        let field3End = command.indexOf('}', field2textEnd + 1);
        let field3 = command.substr(field3Start + 1, field3End - field3Start - 1);
    
        let field3textStart = command.indexOf('(', field3Start + 1);
        let field3textEnd = command.indexOf(')', field3End + 1);
        let field3text = command.substr(field3textStart + 1, field3textEnd - field3textStart - 1);

    

    

    if(field1 && !field2) {
        let embed = new Discord.MessageEmbed
      embed.setTitle(title)
      embed.setColor("RANDOM")
      embed.setDescription(description)
      embed.setThumbnail(thumbnail)
      embed.addField(field1, field1text)
      embed.setFooter(footer)
      embed.setImage(image)
        
        // set author based of passed-in message
    
        // send embed to channel
        channel.send(embed);
    }
    
    if(field2 && !field3) {
        let embed = new Discord.MessageEmbed
      embed.setTitle(title)
      embed.setColor("RANDOM")
      embed.setDescription(description)
      embed.setThumbnail(thumbnail)
      embed.addField(field1, field1text)
      embed.addField(field2, field2text)
      embed.setImage(image)
      embed.setFooter(footer)
        
        // set author based of passed-in message
    
        // send embed to channel
        channel.send(embed);
    }
    
    if(field2 && field3) {
        let embed = new Discord.MessageEmbed
      embed.setTitle(title)
      embed.setColor("RANDOM")
      embed.setDescription(description)
      embed.setThumbnail(thumbnail)
      embed.addField(field1, field1text)
      embed.addField(field2, field2text)
      embed.addField(field3, field3text)
      embed.setImage(image)
      embed.setFooter(footer)
        
        // set author based of passed-in message
    
        // send embed to channel
        channel.send(embed);
    }
    
    if(!field1) {
        let embed1 = new Discord.MessageEmbed()
      .setTitle(title)
      .setColor("RANDOM")
      .setDescription(description)
      .setThumbnail(thumbnail)
      .setImage(image)
      .setFooter(footer)
    
        
        // set author based of passed-in message
    
        // send embed to channel
        channel.send(embed1);
    
    }
    }
const db = require('megadb')
module.exports = {
    name: 'makembed',
    description: "makembed [title] [description] [footer] (thumbnail) [image] {field1} (field1 text) {field} (field2 text) {field3} (field3 text). \n You can use as many fields as you want, but the max is 3. \n If you want to remove an headland, type it as [] or (), it won't be added to the embed. For example \n makembed [title] [description] [] () [] {field1} (field1 text)",
    aliases: ['embed', 'createembed', 'makeembed', 'creatembed'],
	async execute(client, message, args) {
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
              let permiso = datos1.modrole !== 'none' ? message.member.roles.cache.has(datos1.modrole) : message.member.hasPermission('MANAGE_WEBHOOKS')
             let adminperms = datos1.adminrole !== 'none' ? message.member.roles.cache.has(datos1.adminrole) : message.member.hasPermission('MANAGE_WEBHOOKS')
             if(!permiso &&  !adminperms) return
              let langcode = datos1.lang
              if(!args[0]){
        
                let embed = new Discord.MessageEmbed()
                .setTitle("title")
                .setColor("RANDOM")
                .setDescription("description")
                .setThumbnail("https://i.imgur.com/L3RP7Gz.png")
                .addField("field1", "field1 text")
                .addField("field2", "field2 text")
                .addField("field3", "field3 text")
                .setImage("https://i.imgur.com/pG2jegW.png")
                .setFooter("footer")
    
         if(langcode === "es") {
            message.channel.send("Uso: makembed [título] [descripción] [footer] (thumbnail) [image] {field1} (field1 texto) {field2} (field2 texto) {field3} (field3 texto). \n Puedes usar los fields que quieras, pero el máximo es 3. \n Si quieres dejar un apartado en blanco, ponlo como [] o (), simplemente no se añadirá al embed. Por ejemplo \n makembed [título] [descripción] [] () [] {field1} (field1 texto) ", embed)
         } else if(langcode === "en") {
           message.channel.send("Usage: makembed [title] [description] [footer] (thumbnail) [image] {field1} (field1 text) {field} (field2 text) {field3} (field3 text). \n You can use as many fields as you want, but the max is 3. \n If you want to remove an headland, type it as [] or (), it won't be added to the embed. For example \n makembed [title] [description] [] () [] {field1} (field1 text) ", embed)
         }
        }
    
            else {
                sendEmbed(message)
                
            }
            }
          });
        
}
}