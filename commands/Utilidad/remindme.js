const qdb = require("quick.db");
const db = require('megadb')
const bsonDB = require('bsondb')
let remindersDB = new qdb.table("reminders");
module.exports = {
  name: "remindme",
  description: "remindme <time> [reason]",
  aliases: ["radd"],
  async execute(client, message, args) {
    let user = message.author;
   
    let motivo = args.slice(1).join(" ");
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
            let time_v = client.Convert(args[0]);
        if (!motivo) motivo = "No me dijiste por qué querías que te recordara";
        if (!time_v)
          return message.channel.send(
            "Necesito saber cuándo quieres que te avise."
          );
        if (motivo === args.slice(1).join(" "))
          message.channel.send(`Vale, te recordaré ${motivo} en ${time_v.nombre}`);
        if (motivo === "No me dijiste por qué querías que te recordara")
          message.channel.send(`Vale, te lo recordaré en ${time_v.nombre}`);
        let expiration = Date.now() + time_v.tiempo;
        remindersDB.set(`${expiration}`, {
          expirationDate: expiration,
          content: motivo,
          user: user.id,
          notified: false
        });
      } else if(langcode === "en") {
         let time_v = client.eConvert(args[0]);
        if (!motivo) motivo = "No me dijiste por qué querías que te recordara";
        if (!time_v)
          return message.channel.send(
            "When do you want the remind?"
          );
        if (motivo === args.slice(1).join(" "))
          message.channel.send(`Ok, I will remind you ${motivo} in ${time_v.nombre}`);
        if (motivo === "You didn't tell me why did you want this reminder.")
          message.channel.send(`Ok, I will remind you in ${time_v.nombre}`);
        let expiration = Date.now() + time_v.tiempo;
        remindersDB.set(`${expiration}`, {
          expirationDate: expiration,
          content: motivo,
          user: user.id,
          notified: false
        });
      }
          }
        });
     
  }
};
