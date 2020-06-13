const Discord = require("discord.js");
const bsonDB = require("bsondb");

module.exports = async (client, oldMember, newMember) => {
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
  Model.findOne((f) => f.server === oldMember.guild.id, async (datos) => { 
            if (!datos) {
                return
            } else { 
              let langcode = datos.lang
              let logs_channel = oldMember.guild.channels.cache.get(datos.memberlogs)
              if(!logs_channel || logs_channel.type !== "text") return;
              var Changes = {
                unknown: 0,
                addedRole: 1,
                removedRole: 2,
                username: 3,
                nickname: 4
              };
              var change = Changes.unknown;
            
              var removedRole = "";
              var role2 = "";
              oldMember.roles.cache.sweep(function(value) {
                if (newMember.roles.cache.find(r => r.id === value.id) == null) {
                  change = Changes.removedRole;
                  removedRole = value.name;
                  role2 = value;
                }
              });
              var addedRole = "";
              var role = "";
              newMember.roles.cache.sweep(function(value) {
                if (oldMember.roles.cache.find(r => r.id === value.id) == null) {
                  change = Changes.addedRole;
                  addedRole = value.name;
                  role = value;
                }
              });
            
              // check if nickname changed
              if (newMember.nickname != oldMember.nickname) {
                change = Changes.nickname;
              }
              // post in the guild's log channel
              {
                if (langcode === "es") {
                  switch (change) {

                    case Changes.addedRole:
                      logs_channel.send(`Rol añadido a ${newMember.user.tag} - ${newMember.id}: ${role.name}`);
                      break;
                    case Changes.removedRole:
                      logs_channel.send(`Rol removido a ${newMember.user.tag} - ${newMember.id}: ${role2.name}`);
                      break;
                    case Changes.nickname:
                      logs_channel.send(`${newMember.user.tag} (${newMember.user.id}) se ha cambiado de apodo de \`\`${oldMember.nickname === null ? "su nombre" : oldMember.nickname}\`\` a \`\`${newMember.nickname === null ? "su nombre" : newMember.nickname}\`\``);
                      break;
                  }
                } else if (langcode === "en") {
                  switch (change) {

                    case Changes.addedRole:
                      logs_channel.send(`Role added to ${newMember.user.tag} - ${newMember.id}: ${role.name}`);
                      break;
                    case Changes.removedRole:
                      logs_channel.send(`Role removed to ${newMember.user.tag} - ${newMember.id}: ${role2.name}`);
                      break;
                    case Changes.nickname:
                      logs_channel.send(`${newMember.user.tag} (${newMember.user.id}) has changed their nickname from \`\`${oldMember.nickname === null ? "their name" : oldMember.nickname}\`\` to \`\`${newMember.nickname === null ? "their name" : newMember.nickname}\`\``);
                      break;
                  }
                }
            }
            }
          });
}