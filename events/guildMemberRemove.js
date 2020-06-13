const Discord = require("discord.js");
const bsonDB = require("bsondb");
const db = require('megadb')
module.exports = async (client, member) => {
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
              let logs_channel = member.guild.channels.cache.get(datos.memberlogs)
              if (!logs_channel || logs_channel.type !== "text") return;
              
  if (langcode === "es") {
    logs_channel.send(`<:dnd:663871630488895501> El usuario ${member.user.tag} (${member.id}) ha abandonado el servidor, se unió el ${client.convertDate(member.joinedTimestamp)}`);
  } else if (langcode === "en") {
    logs_channel.send(`<:dnd:663871630488895501> ${member.user.tag} (${member.id}) has left the server, joined on ${client.econvertDate(member.joinedTimestamp)}`);
  }
  const muteddb = new db.crearDB('muted')
  let Muted = member.guild.roles.cache.find(mute => mute.name.toLowerCase() === "trimuted")
  if(member.roles.cache.has(Muted.id)) {
    muteddb.set(member.id, {server: [member.guild.id]})
  }
            }
          });
  
}