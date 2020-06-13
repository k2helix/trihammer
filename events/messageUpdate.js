const Discord = require("discord.js");
const bsonDB = require("bsondb");

module.exports = async (client, old_message, new_message) => {
  if(old_message.author.bot) return
  if(!old_message.content && !new_message.content) return
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
  Model.findOne((f) => f.server === old_message.guild.id, async (datos) => { 
            if (!datos) {
                return
            } else { 
              let langcode = datos.lang
              let logs_channel = old_message.guild.channels.cache.get(datos.messagelogs)
             if (!logs_channel || logs_channel.type !== "text") return
              if(old_message.length > 1800 || new_message.length > 1800) return
              if(old_message.content !== new_message.content) {
              if (langcode === "es") {
                logs_channel.send(`Mensaje de ${old_message.author.tag} (${old_message.author.id}) editado en <#${old_message.channel.id}>.\nAntes:\n\`\`\`${old_message.content}\`\`\`Después:\n\`\`\`${new_message.content}\`\`\``);
              } else if (langcode === "en") {
                logs_channel.send(`Message from ${old_message.author.tag} (${old_message.author.id}) edited in <#${old_message.channel.id}>.\nBefore edit:\n\`\`\`${old_message.content}\`\`\`\nAfter edit:\n\`\`\`${new_message.content}\`\`\``);
              }
            }
            }
          });
   
}