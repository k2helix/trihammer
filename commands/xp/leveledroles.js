const Discord = require('discord.js')
const Canvas = require('canvas')
const fs = require('fs')
const db = require('megadb')
const bsonDB = require('bsondb')
const leveldb = new db.crearDB('levels')

module.exports = {
	name: 'leveledroles',
        description: 'leveledroles [remove] <role id> <level>',
	async execute(client, message, args) {
let allroles = JSON.parse(fs.readFileSync("./numberoles.json", "utf8"));
    if(!args[0]) {
 var role = [], ct = 0;
    const arr = [...Array(100).keys()];
    const swearWords = arr;
if (swearWords.some(word => leveldb.tiene(`${word}.${message.guild.id}`))) {
 swearWords.forEach(async swearWords => { 
   if(!leveldb.tiene(`${swearWords}.${message.guild.id}`)) return
  let roles =  await leveldb.obtener(`${swearWords}.${message.guild.id}`)
  if(leveldb.tiene(`${swearWords}.${message.guild.id}`)) {
      
    let rol = message.guild.roles.cache.get(roles[0])
  
    role[role.length + 1] = `Level ${swearWords}: ${rol}`;
      ct++;
    
    if(ct >= allroles[message.guild.id].roles) {
  let embed = new Discord.MessageEmbed()
  .setTitle("XP Roles")
  .setDescription(role)
  message.channel.send(embed)
  }
  }
   })
  }
else {
  message.channel.send("The guild doesn't have xp roles")
}
    }
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
          let langcode = datos1.lang
          if(langcode === "es") {
            if(args[0] === "remove") {
              let permiso = datos1.adminrole !== 'none' ? message.member.roles.cache.has(datos1.adminrole) : message.member.hasPermission('ADMINISTRATOR')
        if(!permiso) return 
              let rolid = args[1]
              let role = message.guild.roles.cache.get(rolid)
              let nivel = args[2]
                let server = message.guild.id
                
                if(!role) return message.channel.send("No existe ese rol.")
        if(leveldb.tiene(`${nivel}.${server}`)) {
          leveldb.eliminar(`${nivel}.${server}`)
        allroles[server].roles = allroles[server].roles - 1
        fs.writeFile("./numberoles.json", JSON.stringify(allroles), (x) => {
          if (x) console.error(x)
          });
        message.channel.send(`Entendido, he quitado el rol ${role.name} del nivel ${nivel} `)
        } else {
          message.channel.send("No hay ningún rol en ese nivel")
        }
            }
            if(args[0] && args[0] != "remove"){
              
              let permiso = datos1.adminrole !== 'none' ? message.member.roles.cache.has(datos1.adminrole) : message.member.hasPermission('ADMINISTRATOR')
              if(!permiso) return  
                let rolid = args[0]
                let nivel = args[1]
                let role = message.guild.roles.cache.get(rolid)
                let server = message.guild.id
                if(!role) return message.channel.send("Uso: leveledroles <id del rol> <nivel>")
                if(isNaN(nivel)) return message.channel.send("Uso: leveledroles <id del rol> <nivel>")
                if(!leveldb.tiene(`${nivel}.${server}`)) {
                    leveldb.establecer(`${nivel}.${server}`, [rolid])     
                } else {
                    leveldb.establecer(`${nivel}.${server}`, [rolid])   
                }
        
        if (!allroles[server]) allroles[server] = {
          roles: 0
          };
        allroles[server].roles++;
        fs.writeFile("./numberoles.json", JSON.stringify(allroles), (x) => {
          if (x) console.error(x)
          });
            message.channel.send(`Ok, el rol ${role.name} se conseguirá al nivel ${nivel}`)
            }
          } else if(langcode === "en") {
            if(args[0] === "remove") {
              let permiso = datos1.adminrole !== 'none' ? message.member.roles.cache.has(datos1.adminrole) : message.member.hasPermission('ADMINISTRATOR')
              if(!permiso) return 
              let rolid = args[1]
              let role = message.guild.roles.cache.get(rolid)
              let nivel = args[2]
                let server = message.guild.id
                
                if(!role) return message.channel.send("That role does not exist")
        if(leveldb.tiene(`${nivel}.${server}`)) {
          leveldb.eliminar(`${nivel}.${server}`)
        allroles[server].roles = allroles[server].roles - 1
        fs.writeFile("./numberoles.json", JSON.stringify(allroles), (x) => {
          if (x) console.error(x)
          });
        message.channel.send(`Understood, I have removed ${role.name} from the level ${nivel} `)
        } else {
          message.channel.send("There isn't a role assigned to that level")
        }
            }
            if(args[0] && args[0] != "remove"){
              
              let permiso = datos1.adminrole !== 'none' ? message.member.roles.cache.has(datos1.adminrole) : message.member.hasPermission('ADMINISTRATOR')
              if(!permiso) return 
                let rolid = args[0]
                let nivel = args[1]
                let role = message.guild.roles.cache.get(rolid)
                let server = message.guild.id
                if(!role) return message.channel.send("Usage: leveledroles <role id> <level>")
                if(isNaN(nivel)) return message.channel.send("Usage: leveledroles <role id> <level>")
                if(!leveldb.tiene(`${nivel}.${server}`)) {
                    leveldb.establecer(`${nivel}.${server}`, [rolid])     
                } else {
                    leveldb.establecer(`${nivel}.${server}`, [rolid])   
                }
        
        if (!allroles[server]) allroles[server] = {
          roles: 0
          };
        allroles[server].roles++;
        fs.writeFile("./numberoles.json", JSON.stringify(allroles), (x) => {
          if (x) console.error(x)
          });
            message.channel.send(`Ok, the role ${role.name} will be reached at level ${nivel}`)
            }
          }
          }
        });
     
  }
}