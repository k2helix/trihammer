const Discord = require("discord.js");
const bsonDB = require("bsondb");

module.exports = async (client, messages) => {
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
      let msg = messages.first()
  Model.findOne((f) => f.server === msg.guild.id, async (datos) => { 
            if (!datos) {
                return
            } else { 
              let langcode = datos.lang
              let logs_channel = msg.guild.channels.cache.get(datos.messagelogs)
              if (!logs_channel || logs_channel.type !== "text") return;
            if(!msg.content) return
            const array = []
  messages.forEach(async message => {
    if(!message.content) return
    if (message.author.bot || message.system) return;
    array.push(`${message.author.tag} (${message.author.id}): ${message.content}`)
  })
if(langcode === "es") {
    const embed = new Discord.MessageEmbed()
  .setTitle(`${messages.size} mensajes borrados`)
  .setDescription(`\`\`\`css\n${array.join('\n').slice(0, 2000)}\`\`\``)
    .setFooter(`Mostrando ${array.join('\n').slice(0, 2000).length} de ${array.join('\n').length} caracteres.`)
  logs_channel.send(embed)
} else if(langcode === "en") {
  const embed = new Discord.MessageEmbed()
  .setTitle(`${messages.size} messages were deleted`)
  .setDescription(`\`\`\`css\n${array.join('\n').slice(0,2000)}\`\`\``)
  .setFooter(`Showing ${array.join('\n').slice(0, 2000).length}  of ${array.join('\n').length} characters.`)
  logs_channel.send(embed)
}
            }
          });


}