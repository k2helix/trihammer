const db = require('megadb')
const bsonDB = require('bsondb')
const ytdl = require ('ytdl-core')
module.exports = {
	name: 'adminrole',
	description: 'adminrole <role id>',
	aliases: ['admin-role'],
	async execute(client, message, args) {
    let rol = args[0]
        if(!rol) return
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
            let rol = message.guild.roles.cache.find(r => r.name === args.join(' ')) || message.guild.roles.cache.get(args[0])
            if(!rol) return message.channel.send('Error, name or id')
                  if (!datos) {
                      if(!message.member.hasPermission('ADMINISTRATOR')) return
                     let NuevoModelo = Model.buildModel({
                        server: message.guild.id,
                        modrole: rol.id,
                        adminrole: 'none',
                        messagelogs: 'none',
                        voicelogs: 'none',
                        actionslogs: 'none',
                        memberlogs: 'none',
                        serverlogs: 'none',
                        infrlogs: 'none',
                        prefix: 't-',
                        lang: 'en'
                    })
               NuevoModelo.save().then(data => {
                 message.channel.send(`Ok.`)
               }).catch(error => console.log(error))   
                  } else {
                    let permiso = datos.adminrole !== 'none' ? message.member.roles.cache.has(datos.adminrole) : message.member.hasPermission('ADMINISTRATOR')
                   if(!permiso) return
                   let langcode = datos.lang
                   datos.adminrole = rol.id
                   datos.save().then(nuevo_dato => { 
                     if(langcode === "es") {
                       message.channel.send(`Ok, rol ${message.guild.roles.cache.get(nuevo_dato.adminrole).name} establecido como el rol de administrador.`)
                     } else if(langcode === "en") {
                      message.channel.send(`Ok, role ${message.guild.roles.cache.get(nuevo_dato.adminrole).name} set as administrator role.`)
                     }
                   });
                  }
                });
    }
}