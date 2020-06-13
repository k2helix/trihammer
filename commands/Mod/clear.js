const bsonDB = require('bsondb')
module.exports = {
	name: 'clear',
        description: 'clear.',
	execute(client, message, args) {
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
                    Model.findOne((f) => f.server === message.guild.id, async (datos1) => { 
                        
                              if (!datos1) {
                               return  
                              } else {
                                let permiso = datos1.modrole !== 'none' ? message.member.roles.cache.has(datos1.modrole) : message.member.hasPermission('MANAGE_MESSAGES')
                               let adminperms = datos1.adminrole !== 'none' ? message.member.roles.cache.has(datos1.adminrole) : message.member.hasPermission('MANAGE_MESSAGES')
             if(!permiso &&  !adminperms) return
                               let langcode = datos1.lang
                               message.channel.messages.fetch().then(function(list){
                                    message.channel.bulkDelete(list);
                                }, function(err){message.channel.send("Error: "+ err)})
                              }
                        });
      
        }
	}