const Discord = require("discord.js");
const bsonDB = require("bsondb");

module.exports = async (client, role) => {
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
  Model.findOne((f) => f.server === role.guild.id, async (datos) => { 
            if (!datos) {
                return
            } else { 
              let langcode = datos.lang
              let logs_channel = role.guild.channels.cache.get(datos.serverlogs)
              if (!logs_channel || logs_channel.type !== "text") return;            
  if (langcode === "es") {
    logs_channel.send(`Un rol ha sido creado: ${role.name}`);
  } else if (langcode === "en") {
    logs_channel.send(`A role has been created: ${role.name}`);
  }
            }
          });

}