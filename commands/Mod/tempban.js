const Discord = require('discord.js');
const qdb = require("quick.db");
const db = require('megadb')
let tempbansDB = new qdb.table("tempbans");
const fs = require('fs')
const bsonDB = require('bsondb')
module.exports = {
    name: 'tempban',
    description: 'tempban <user> <time> [reason]',
	async execute(client, message, args) {
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
              let permiso = datos1.modrole !== 'none' ? message.member.roles.cache.has(datos1.modrole) : message.member.hasPermission('BAN_MEMBERS')
             let adminperms = datos1.adminrole !== 'none' ? message.member.roles.cache.has(datos1.adminrole) : message.member.hasPermission('BAN_MEMBERS')
             if(!permiso &&  !adminperms) return
             let langcode = datos1.lang
             let logs_channel = message.guild.channels.cache.get(datos1.infrlogs)
             const key = Math.random().toString(36).substring(2, 15).slice(0, 6)
          if(langcode === "es") {
        //si quieres se puede poner aqui para que el comando solo x persona pueda hacerlo, x rol o persona con x permiso
        const server = message.guild

        let autor = message.author
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!member) return message.channel.send("Por favor pon la id de un miembro válido de este servidor");
        let time_v = client.Convert(args[1])
        if(!time_v) return message.channel.send("Pon el tiempo")
            if(!member.bannable) 
              return message.channel.send("No puedo banear a este usuario");
            let reason = args.slice(2).join(' ');
            if(!reason) reason = "No se ha proporcionado ningún motivo"
        const embed5 = new Discord.MessageEmbed()
        .setTitle('Moderación: Tempban')
        .setColor("RANDOM")
        .setDescription(`⚠ **|** Has sido baneado temporalmente en ${server}`)
        .addField('Razón:', `${reason}`)
        .addField('Tiempo:', `${time_v.nombre}`)
        .setFooter(`Fuiste baneado por: ${autor.tag}`)
        member.send(embed5).catch(error => {
       console.log(error)
     })
        if (message.channel.type == "dm") return;
            if(!reason) reason = "No se proporcionó ningún motivo";
            let SchemaTBan = new bsonDB.Schema({
      key: String,
      id: String,
      server: String,
      tipo: String,
      duration: String,
      time: String,
      mod: String,
      reason: String
          })
      let Model = new bsonDB.Model("Infracciones", SchemaTBan)
          let keye = 0
      Model.all((datos) => {
        keye = datos.length
      });
 let NuevoGModelo = Model.buildModel({
        id: member.id,
        server: message.guild.id,
        key: keye.toString(),
        time: `${message.createdTimestamp}`,
        duration: args[1],
        mod: autor.tag,
        tipo: 'tempban',
        reason: reason
              })
           NuevoGModelo.save().catch(error => console.log(error))
            
            member.ban(reason)
              .catch(err =>  {
      const key = Math.random().toString(36).substring(2, 15).slice(0, 7)
     const logs = client.channels.cache.get('640548372574371852')
      const embed = new Discord.MessageEmbed()
      .setTitle('Error')
      .setDescription(err)
      .setColor('RED')
      .addField('Código de error', key)
      .addField('Comando', message.content)
      .addField('Usuario', message.author.tag + ` (${message.author.id})`)
      .addField('Servidor', message.guild.name + ` (${message.guild.id})`)
      logs.send(embed)
       if(langcode === "es") {
              message.channel.send(`Ha ocurrido un error, puedes acudir al servidor de soporte (la invitación es EjG6XZs) y pedir ayuda con el código de error ${key}. ${err}`)
       } else if(langcode === "en") {
         message.channel.send(`An error ocurred, you can join to the support server (the invite is EjG6XZs) and ask for help with the error code ${key}. ${err}`)
       }

    });
              message.channel.send(`${member.user.tag} fue baneado durante ${time_v.nombre}: ${reason}`);
            let expiration = Date.now() + time_v.tiempo;
    tempbansDB.set(`${keye}`, {
      expirationDate: expiration,
      user: member.id,
      server: message.guild.id,
      key: keye.toString(),
      notified: false
    });

if(!logs_channel) return
logs_channel.send(`:hammer: TEMPBAN
Usuario: ${member.user.tag}
Moderador: ${autor.tag}
ID: ${member.id}
Razón: ${reason}
Tiempo: ${time_v.nombre}`)
}
          else if(langcode === "en") {
     if(args[0] === client.config.admin1) return
        //si quieres se puede poner aqui para que el comando solo x persona pueda hacerlo, x rol o persona con x permiso
        const server = message.guild
        let logschannel = JSON.parse(fs.readFileSync("./logschannels.json", "utf8"));
  if(!logschannel[message.guild.id]){
    logschannel[message.guild.id] = {
      logschannel: message.guild.channels.cache.find(c => c.name === "logs")
    };
  }
  let logschannel2 = logschannel[message.guild.id].logschannel;
	let logs_channel = message.guild.channels.cache.get(logschannel2)
        let autor = message.author
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!member)
              return message.channel.send("Please type an valid id of a member.");
        let time_v = client.eConvert(args[1])
        if(!time_v) return message.channel.send("Type the time")
            if(!member.bannable) 
              return message.channel.send("I can't ban that user");
            let reason = args.slice(2).join(' ');
            if(!reason) reason = "No reason given"
        const embed5 = new Discord.MessageEmbed()
        .setTitle('Moderation: Tempban')
        .setColor("RANDOM")
        .setDescription(`⚠ **|** You have been banned in ${server}`)
        .addField('Reason:', `${reason}`)
        .addField('Time:', `${time_v.nombre}`)
        .setFooter(`You were banned by: ${autor.tag}`)
        member.send(embed5).catch(error => {
       console.log(error)
     }) 
        if (message.channel.type == "dm") return;
             let SchemaTBan = new bsonDB.Schema({
      key: String,
      id: String,
      server: String,
      tipo: String,
      duration: String,
      time: String,
      mod: String,
      reason: String
          })
      let Model = new bsonDB.Model("Infracciones", SchemaTBan)
                let keye = 0
      Model.all((datos) => {
        keye = datos.length
      });
 let NuevoGModelo = Model.buildModel({
        id: member.id,
        server: message.guild.id,
        key: keye.toString(),
        time: `${message.createdTimestamp}`,
        duration: args[1],
        mod: autor.tag,
        tipo: 'tempban',
        reason: reason
              })
           NuevoGModelo.save().catch(error => console.log(error))
            
            member.ban(reason)
              .catch(err =>  {
      const key = Math.random().toString(36).substring(2, 15).slice(0, 7)
     const logs = client.channels.cache.get('640548372574371852')
      const embed = new Discord.MessageEmbed()
      .setTitle('Error')
      .setDescription(err)
      .setColor('RED')
      .addField('Código de error', key)
      .addField('Comando', message.content)
      .addField('Usuario', message.author.tag + ` (${message.author.id})`)
      .addField('Servidor', message.guild.name + ` (${message.guild.id})`)
      logs.send(embed)
       if(langcode === "es") {
              message.channel.send(`Ha ocurrido un error, puedes acudir al servidor de soporte (la invitación es EjG6XZs) y pedir ayuda con el código de error ${key}. ${err}`)
       } else if(langcode === "en") {
         message.channel.send(`An error ocurred, you can join to the support server (the invite is EjG6XZs) and ask for help with the error code ${key}. ${err}`)
       }

    });
              message.channel.send(`${member.user.tag} has been banned for ${time_v.nombre}: ${reason}`);
            let expiration = Date.now() + time_v.tiempo;
    tempbansDB.set(`${keye}`, {
      expirationDate: expiration,
      user: member.id,
      server: message.guild.id,
      key: keye.toString(),
      notified: false
    });
           

if(!logs_channel) return
logs_channel.send(`:hammer: TEMPBAN
User: ${member.user.tag}
Moderator: ${autor.tag}
ID: ${member.id}
Reason: ${reason}
Time: ${time_v.nombre}`)
}
            }
          });
          

    
}
  }