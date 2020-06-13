
const Discord = require("discord.js");
const bsonDB = require("bsondb");

module.exports = async (client, oldChannel, newChannel) => {
    if (oldChannel.type === "dm") return;
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
  Model.findOne((f) => f.server === oldChannel.guild.id, async (datos) => { 
            if (!datos) {
                return
            } else {
              let langcode = datos.lang
              let logs_channel = oldChannel.guild.channels.cache.get(datos.serverlogs)
             if (!logs_channel || logs_channel.type !== "text") return;
              if(oldChannel.position !== newChannel.position) return
              if(oldChannel.parent !== newChannel.parent) return
oldChannel.guild.roles.cache.forEach(role => {
               let oldroleperms = new Discord.Permissions(oldChannel.permissionsFor(role).bitfield).toArray()
             let newroleperms = new Discord.Permissions(newChannel.permissionsFor(role).bitfield).toArray()
             let nuevoperm = newroleperms.filter(x => !oldroleperms.includes(x))
             let permremoved = oldroleperms.filter(x => !newroleperms.includes(x))
             if(langcode === "es") {
               if(nuevoperm[0] && permremoved[0]) {
                  return logs_channel.send(`Los permisos del rol \`\`${role.name}\`\` han cambiado en el canal <#${oldChannel.id}>, se le ha añadido: \`\`${nuevoperm.join(', ')}\`\`. Se le ha removido: \`\`${permremoved.join(', ')}\`\``)
               } else if(permremoved[0]) {
                return logs_channel.send(`Los permisos del rol \`\`${role.name}\`\` han cambiado en el canal <#${oldChannel.id}>, se le ha removido: \`\`${permremoved.join(', ')}\`\``)
               } else if(nuevoperm[0]) {
                return logs_channel.send(`Los permisos del rol \`\`${role.name}\`\` han cambiado en el canal <#${oldChannel.id}>, se le ha añadido: \`\`${nuevoperm.join(', ')}\`\``)
               }
              
             } else if(langcode === "en") {
               if(nuevoperm[0] && permremoved[0]) {
                   return  logs_channel.send(`\`\`${role.name}\`\` role permissions have been updated in the channel <#${oldChannel.id}>, added: \`\`${nuevoperm.join(', ')}\`\`. Removed: \`\`${permremoved.join(', ')}\`\` `)
               } else if(permremoved[0]) {
                return logs_channel.send(`\`\`${role.name}\`\` role permissions have been updated in the channel <#${oldChannel.id}>, removed: \`\`${permremoved.join(', ')}\`\``)
             } else if(nuevoperm[0]) {
                return  logs_channel.send(`\`\`${role.name}\`\` role permissions have been updated in the channel <#${oldChannel.id}>, added: \`\`${nuevoperm.join(', ')}\`\``)
             }
             }
})
     
           
             var Changes = {
              unknown: 0,
              name: 1,
              topic: 2
            };
            var change = Changes.unknown;
          
            // check if username changed
            if (newChannel.name != oldChannel.name) {
              change = Changes.name;
            }
            // check if nickname changed
            // post in the guild's log channel
            
          
              if (langcode === "es") {
                switch (change) {
                  case Changes.name:
                    logs_channel.send(`El canal ${newChannel} ha cambiado de nombre, antes era \`\`${oldChannel.name}\`\``);
                    break;
                }
              } else if (langcode === "en") {
                switch (change) {
                  case Changes.name:
                    logs_channel.send(`Change in the name of ${oldChannel.name}, now is \`\`${newChannel.name}\`\``);
                    break;
                }
              }
            
            }
          });


}