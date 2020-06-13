const Discord = require("discord.js");
const bsonDB = require("bsondb");

module.exports = async (client, channel) => {
    if (channel.type === "dm") return;
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
  Model.findOne((f) => f.server === channel.guild.id, async (datos) => { 
            if (!datos) {
                return
            } else {
             let langcode = datos.lang
             let logs_channel = channel.guild.channels.cache.get(datos.serverlogs)
             if (!logs_channel || logs_channel.type !== "text") return;

  if (langcode === "es") {
    logs_channel.send(`Un canal ha sido borrado: ${channel.name}`);
  } else if (langcode === "en") {
    logs_channel.send(`A channel has been removed: ${channel.name}`);
  }
}
});
}