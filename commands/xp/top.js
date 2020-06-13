const bsonDB = require('bsondb') 
module.exports = {
    name: 'top',
    description: 'top [global]',
    aliases: ['leaderboard', 'ranking'], 
    execute(client, message, args) {
      let SchemaNivel = new bsonDB.Schema({
        id: String,
        server: String,
        nivel: Number,
        xp: Number
      })

      let NivelModel = new bsonDB.Model('Nivelesrank', SchemaNivel)
      if(args[0] === 'global') {
      let SchemaGlobalNivel = new bsonDB.Schema({
        id: String,
        globalxp: Number,
        pimage: String,
        rimage: String,
        pdesc: String,
        ptext: String,
        rep: Number,
        cooldown: Number,
        repcooldown: Number
            })
  
      let GlobalNivelModel = new bsonDB.Model('UserTest', SchemaGlobalNivel)
      GlobalNivelModel.filter((modelo) => modelo.globalxp >= 0,async (datos) => { 
      if (!datos) {
        return console.log('No se encontró nada.');
      } else {
      
        datos.sort((a, b) => {
          return b.nivel - a.nivel || b.globalxp - a.globalxp
        })
        let posicion = (element) => element.id === message.author.id
        let usuarios = [];
        for(var x in datos.slice(0, 10)) {
          let user = await client.users.fetch(datos[x].id)
          usuarios.push(`${parseFloat(x)+1} - ${user.tag}:\nGlobal XP ${datos[x].globalxp}`)
        }
        GlobalNivelModel.findOne((f) => f.id == message.author.id, async (datos2) => {
        message.channel.send(`** - 🏆 Global Rank -  **\n\`\`\`${usuarios.join("\n")}\n-------------------------------------\n Your stats:\n Rank ${datos.sort((a,b) => { return b.nivel - a.nivel || b.globalxp - a.globalxp }).findIndex(posicion) + 1}\n Global XP ${datos2.globalxp}  \`\`\``)
        });
      }
    });
      } 
  
else {
      NivelModel.filter((modelo) => modelo.server === message.guild.id, (datos) => { 
       
      if (!datos) {
        return console.log('No se encontró nada.');
      } else {
      let posicion = (element) => element.id === message.author.id
        datos.sort((a, b) => {
          return b.nivel - a.nivel || b.xp - a.xp
        })
        
        let usuarios = [];
        for(var x in datos.slice(0, 10)) {
          let user = message.guild.members.cache.has(datos[x].id) ? message.guild.members.cache.get(datos[x].id).user.tag : "User who left the guild/n ("+datos[x].id+")"
          usuarios.push(`${parseFloat(x)+1} - ${user}:\nLevel ${datos[x].nivel} ~ XP ${datos[x].xp}`)
        }
        NivelModel.findOne((f) => f.id == message.author.id && f.server == message.guild.id, async (datos3) => {
        message.channel.send(`** - 🏆 Server Rank -  **\n\`\`\`${usuarios.join("\n")}\n-------------------------------------\n Your stats:\n Rank ${datos.sort((a,b) => { return b.nivel - a.nivel || b.xp - a.xp }).findIndex(posicion) + 1}\n Level ${datos3.nivel} XP ${datos3.xp}  \`\`\``)
        });
      
        
      }
    });
  }
}
} 