// const mongoose = require('mongoose')
// const bsonDB = require('bsondb')
// module.exports = {
//   name: 'restore-rank',
//   usage: 'jumbo <emoji>',
//  async execute(client, message, args) {
//     if(message.author.id !== '461279654158925825') return
//     let SchemaNivel = new bsonDB.Schema({
//         id: String,
//         server: String,
//         nivel: Number,
//         xp: Number
//       });
//       //Creamos la base de datos y inicializamos su schema (SchemaNivel)
//       let NivelModel = new bsonDB.Model("Nivelesrank", SchemaNivel);
//     client.guilds.cache.forEach(guild => {
//         guild.members.cache.forEach(member => {
//             if(member.user.bot) return
//         NivelModel.findOne((f) => f.id === member.user.id && f.server === guild.id, async (datos) => {
//       if(!datos) {return}
//       else {
//          let users = new client.ModelRank({
//             id: member.user.id,
//             server: guild.id,
//             nivel: datos.nivel,
//             xp: datos.xp
//           });
//          await users.validate()
//          await users.save()
//       }

//       });
//         })

//     })

//  }
// }
