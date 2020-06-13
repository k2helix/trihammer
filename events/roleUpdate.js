const Discord = require("discord.js");
const bsonDB = require("bsondb");

module.exports = async (client, oldRole, newRole) => {
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
  Model.findOne((f) => f.server === oldRole.guild.id, async (datos) => { 
            if (!datos) {
                return
            } else { 
              if(oldRole.position !== newRole.position) return
              let oldroleperms = new Discord.Permissions(oldRole.permissions).toArray()
             let newroleperms = new Discord.Permissions(newRole.permissions).toArray()
             let nuevoperm = newroleperms.filter(x => !oldroleperms.includes(x))
             let permremoved = oldroleperms.filter(x => !newroleperms.includes(x))
              let langcode = datos.lang
              let logs_channel = oldRole.guild.channels.cache.get(datos.serverlogs)
              if (!logs_channel || logs_channel.type !== "text") return;            
  if (langcode === "es") {
   if(nuevoperm[0] && permremoved[0]) {
      logs_channel.send(`Los permisos del rol \`\`${newRole.name}\`\` han sido actualizados, se le ha añadido: \`\`${nuevoperm.join(', ')}\`\`. Se le ha removido: \`\`${permremoved.join(', ')}\`\``);
    } else if(permremoved[0]) {
      logs_channel.send(`Los permisos del rol \`\`${newRole.name}\`\` han sido actualizados, se le ha removido: \`\`${permremoved.join(', ')}\`\``);
    } else if(nuevoperm[0]) {
           logs_channel.send(`Los permisos del rol \`\`${newRole.name}\`\` han sido actualizados, se le ha añadido: \`\`${nuevoperm.join(', ')}\`\``);
    } else {
      logs_channel.send(`Un rol ha sido actualizado: \`\`${newRole.name}\`\``);
    }
  } else if (langcode === "en") {
    if(nuevoperm[0] && permremoved[0]) {
      logs_channel.send(`\`\`${newRole.name}\`\` role permissions have been updated, added: \`\`${nuevoperm.join(', ')}\`\`. Removed: \`\`${permremoved.join(', ')}\`\``);
    } else if(permremoved[0]) {
      logs_channel.send(`\`\`${newRole.name}\`\` role permissions have been updated, removed: \`\`${permremoved.join(', ')}\`\``);
    } else if(nuevoperm[0]) {
           logs_channel.send(`\`\`${newRole.name}\`\` role permissions have been updated, added: \`\`${nuevoperm.join(', ')}\`\``);
    }
    else {
      logs_channel.send(`A role has been updated: \`\`${newRole.name}\`\``);
    }
    
  }
            }
          });

}