// const mongoose = require('mongoose')
// const bsonDB = require('bsondb')
// const db = require('quick.db')
// module.exports = {
//   name: 'restore-reminders',
//   usage: 'jumbo <emoji>',
//  async execute(client, message, args) {
//     if(message.author.id !== '461279654158925825') return
//     const remindersDB = new db.table("reminders");
//     for (let reminder of remindersDB.all()) {
//       reminder = JSON.parse(reminder.data);
//       if(reminder.notified) continue
//       let remind = new client.ModelRemind({
//            id: reminder.user,
//            reason: reminder.content,
//            active: true,
//            expire: reminder.expirationDate
//         });
//         await remind.validate()
//         await remind.save()
//     }

//  }
// }
