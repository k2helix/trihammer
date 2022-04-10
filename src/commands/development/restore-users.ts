// const mongoose = require('mongoose')
// const bsonDB = require('bsondb')
// module.exports = {
//   name: 'restore-users',
//   usage: 'jumbo <emoji>',
//  async execute(client, message, args) {
//     if(message.author.id !== '461279654158925825') return
//     let SchemaGlobalXP = new bsonDB.Schema({
//         id: String,
//         globalxp: Number,
//         pimage: String,
//         rimage: String,
//         pdesc: String,
//         ptext: String,
//         rep: Number,
//         cooldown: Number,
//         repcooldown: Number
//             })

//       //Creamos la base de datos y inicializamos su schema (SchemaNivel)
//       let GlobalXPModel = new bsonDB.Model("UserTest", SchemaGlobalXP);
//     client.users.cache.forEach(user => {
//         if(user.bot) return
//         GlobalXPModel.findOne((f) => f.id === user.id, async (datos) => {
//       if(!datos) {return}
//       else {
//          let users = new client.ModelUsers({
//             id: user.id,
//             globalxp: datos.globalxp,
//             pimage: datos.pimage,
//             rimage: datos.rimage,
//             pdesc: datos.pdesc,
//             ptext: datos.ptext,
//             rep: datos.rep,
//             cooldown: datos.cooldown,
//             repcooldown: datos.repcooldown
//           });
//          await users.validate()
//          await users.save()
//       }

//       });
//     })

//  }
// }
