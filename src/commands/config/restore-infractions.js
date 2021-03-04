// const mongoose = require('mongoose')
// module.exports = {
//   name: 'restore-infractions',
//   usage: 'jumbo <emoji>',
//  async execute(client, message, args) {
//     if(message.author.id !== '461279654158925825') return
//     client.guilds.cache.forEach(guild => {
//      let data = await client.ModelServerTest.findOne({server: guild.id})
//      let gData = await client.ModelServer.findOne({server: guild.id})
//      if(!data) {
//         let newGuildModel = new client.ModelServerTest({
//             id: guild.id,
//             server: [{"lang": gData.lang, "prefix": gData.prefix, "msg-logs": gData.messagelogs, "vc-logs": gData.voicelogs, "act-logs": gData.actionslogs, "mb-logs": gData.memberlogs, "inf-logs": gData.infrlogs, "sv-logs": gData.serverlogs, spam: gData.antispam}],
//             roles: [{"staff": {"mod": gData.modrole, "admin": gData.adminrole, "join": gData.autorole}}]
//     });
//     await newGuildModel.save()
//     return console.log(`${guild.name} guardado ;)`)
//      } else {
//       console.log(`${guild.name} tiene datos`)
//      }
//     })
//  }
// }
