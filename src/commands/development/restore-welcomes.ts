// const mongoose = require('mongoose')
// const bsonDB = require('bsondb')
// module.exports = {
//   name: 'restore-welcomes',
//   usage: 'jumbo <emoji>',
//  async execute(client, message, args) {
//     if(message.author.id !== '461279654158925825') return
//     let SchemaW = new bsonDB.Schema({
//         server: String,
//         canal: String,
//         color: String,
//         image: String,
//         text: String
//       });
//       let ModelW = new bsonDB.Model("Welcomes", SchemaW)
//     client.guilds.cache.forEach(guild => {
//       ModelW.findOne((f) => f.server === guild.id, async (datos) => {
//       if(!datos) {return console.log('no hay datos')}
//       else {
//          let server = new client.ModelWelc({
//             server: guild.id,
//             canal: datos.canal,
//             color: datos.color,
//             image: datos.image,
//             text: datos.text
//           });
//          await server.validate()
//          await server.save()
//       }

//       });
//     })

//  }
// }
