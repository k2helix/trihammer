// const mongoose = require('mongoose')
// module.exports = {
//   name: 'restore-servers',
//   usage: 'jumbo <emoji>',
//  async execute(client, message, args) {
//     if(message.author.id !== '461279654158925825') return
//     client.guilds.cache.forEach(async guild => {
//      let data = await client.ModelServerTest.findOne({id: guild.id})
//      let gData = await client.ModelServer.findOne({server: guild.id})
//      let lvlRoles = await client.ModelLvlRol.find({server: guild.id})
//      let infrs = await client.ModelInfrs.find({server: guild.id})
//      if(!data) {
//         let newGuildModel = new client.ModelServerTest({
//             id: guild.id,
//             server: [{}],
//             roles: [{}],
//             infrs: [],
//             temp: [{}]
//     });
//     await newGuildModel.save()
//     return console.log(`${guild.name} creado`)
//      } else {
//       // if(gData.messagelogs !== "none") data.server[0]['msg-logs'] = gData.messagelogs
//       // if(gData.voicelogs !== "none") data.server[0]['vc-logs'] = gData.voicelogs
//       // // if(gData.actionslogs !== "none") data.server[0]['act-logs'] = gData.actionslogs
//       // if(gData.memberlogs !== "none") data.server[0]['mb-logs'] = gData.memberlogs
//       // if(gData.infrlogs !== "none") data.server[0]['inf-logs'] = gData.infrlogs
//       // if(gData.serverlogs !== "none") data.server[0]['sv-logs'] = gData.serverlogs
//       // data.server[0]['prefix'] = gData.prefix
//       // data.server[0]['lang'] = gData.lang
//       // await data.save()

//       // data.roles[0].staff = {}
//       // data.roles[0].lvl = {}
//       // data.roles[0].staff = {}
//       // if(gData.modrole !== 'none') data.roles[0].staff["mod"] = gData.modrole
//       // if(gData.adminrole !== 'none') data.roles[0].staff["admin"] = gData.adminrole
//       // if(gData.autorole !== 'none') data.roles[0].staff["join"] = gData.autorole
//       // await data.save()

//       // if(lvlRoles[0]) {
//       //  lvlRoles.forEach(role => {
//       //    data.roles[0].lvl[role.level] = [role.id]
//       //  })
//       // }
//       // await data.save()

//       // if(infrs[0]) {
//       // infrs.forEach(infr => {
//       //  data.infrs.push(infr)
//       // })
//       // }
//       data.server[0]['msg-logs'] = "1"
//       await data.save()
//       console.log(`${guild.name} guardado`)
//      }
//     })

//  }
// }
// // server: [{"lang": gData.lang, "prefix": gData.prefix, "msg-logs": gData.messagelogs, "vc-logs": gData.voicelogs, "act-logs": gData.actionslogs, "mb-logs": gData.memberlogs, "inf-logs": gData.infrlogs, "sv-logs": gData.serverlogs, spam: gData.antispam}],
// // roles: [{"staff": {"mod": gData.modrole, "admin": gData.adminrole, "join": gData.autorole}}]

// // server: message.guild.id,
// // role: rol.id,
// // level: Number(nivel)ç

// // key: String,
// // id: String,
// // server: String,
// // duration: String,
// // tipo: String,
// // time: String,
// // mod: String,
// // reason: String
