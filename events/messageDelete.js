const Discord = require("discord.js");
const bsonDB = require("bsondb");

module.exports = async (client, message) => {
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
  Model.findOne((f) => f.server === message.guild.id, async (datos) => { 
            if (!datos) {
                return
            } else { 
              let langcode = datos.lang
              if (message.author.bot || message.system) return;
              let logs_channel = message.guild.channels.cache.get(datos.messagelogs)
              if(!logs_channel || logs_channel.type !== "text") return;
              if(!message.content) return
              if (langcode === "es") {
                logs_channel.send(`Mensaje de ${message.author.tag} borrado:\`\`\`${message.content}\`\`\``);
              } else if (langcode === "en") {
                logs_channel.send(`Message from ${message.author.tag} deleted:\`\`\`${message.content}\`\`\``);
              }
            }
          });
         
              

}