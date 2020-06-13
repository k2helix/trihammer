
const Discord = require('discord.js')
const math = require('mathjs');
const bsonDB = require('bsondb')
function formatNumber(number, minimumFractionDigits = 0) {
		return Number.parseFloat(number).toLocaleString(undefined, {
			minimumFractionDigits,
			maximumFractionDigits: 2
		});
}
module.exports = {
	name: 'convert',
	description: 'Get information about the time in another time-zone',
  aliases: ['units', 'conver-units'],
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
      const amount = args[0]
      const base = args[1]
      const target = args[2]
				  if (!datos1) {
				   return  
				  } else {
          let langcode = datos1.lang
        let prefix = datos1.prefix
          if(langcode === "es") {
            if(!amount) return message.channel.send(`Debe ser ${prefix}convert <cantidad> <unidad base> <unidad objetivo> (separado por espacios)`)
     const value = math.unit(amount, base).toNumber(target);
			return message.channel.send(`${formatNumber(amount)} ${base} son ${formatNumber(value)} ${target}.`);
          } else if(langcode === "en") {
            if(!amount) return message.channel.send(`It should be ${prefix}convert <amount> <base unit> <target unit> (separated by espaces)`)
      const value = math.unit(amount, base).toNumber(target);
			return message.channel.send(`${formatNumber(amount)} ${base} is ${formatNumber(value)} ${target}.`);
          }
          }
          });
			 

	}
};