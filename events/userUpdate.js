const Discord = require("discord.js");
const bsonDB = require("bsondb");

module.exports = async (client, oldUser, newUser) => {

  if (oldUser.tag !== newUser.tag) {
    client.guilds.cache.forEach(async g => {
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
    Model.findOne((f) => f.server === g.id, async (datos) => { 
              if (!datos) {
                  return
              } else { 
                let langcode = datos.lang
                let logs_channel = g.channels.cache.get(datos.memberlogs)
                if (!logs_channel || logs_channel.type !== "text") return;    
              
      if (!g.members.cache.has(oldUser.id)) return;
      if (!logs_channel || logs_channel.type !== "text") return;
      if (langcode === "es") {
        logs_channel.send(`El usuario ${oldUser.tag} ha cambiado de nombre de usuario, antes era \`\`${oldUser.tag}\`\` y ahora es \`\`${newUser.tag}\`\`.`);
      } else if (langcode === "en") {
        logs_channel.send(`User ${oldUser.tag} has changed their username, before change was \`\`${oldUser.tag}\`\` and after change \`\`${newUser.tag}\`\`.`);
      }
    }
            });
    });
  }
}