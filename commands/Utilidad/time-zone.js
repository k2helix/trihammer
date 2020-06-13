
const Discord = require('discord.js')
const moment = require('moment-timezone');
const bsonDB = require('bsondb')
function firstUpperCase(text, split = ' ') {
		return text.split(split).map(word => `${word.charAt(0).toUpperCase()}${word.slice(1)}`).join(' ');
	}
module.exports = {
	name: 'time-zone',
	description: 'Get information about the time in another time-zone',
  aliases: ['timezone'],
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
          let langcode = datos1.lang
          const timeZone = args.join(' ')
          if(langcode === "es") {
            if (!moment.tz.zone(timeZone)) {
			return message.channel.send('Zona horaria inválida. Ve a <https://en.wikipedia.org/wiki/List_of_tz_database_time_zones>.');
		}
    const time = moment().tz(timeZone).format('h:mm A');
		const location = timeZone.split('/');
		const main = firstUpperCase(location[0], /[_ ]/);
		const sub = location[1] ? firstUpperCase(location[1], /[_ ]/) : null;
		const subMain = location[2] ? firstUpperCase(location[2], /[_ ]/) : null;
		const parens = sub ? ` (${subMain ? `${sub}, ` : ''}${main})` : '';
		return message.channel.send(`La hora actual en ${subMain || sub || main}${parens} es ${time}.`);
          } else if(langcode === "en") {
            if (!moment.tz.zone(timeZone)) {
			return message.channel.send('Invalid time zone. Refer to <https://en.wikipedia.org/wiki/List_of_tz_database_time_zones>.');
		}
    const time = moment().tz(timeZone).format('h:mm A');
		const location = timeZone.split('/');
		const main = firstUpperCase(location[0], /[_ ]/);
		const sub = location[1] ? firstUpperCase(location[1], /[_ ]/) : null;
		const subMain = location[2] ? firstUpperCase(location[2], /[_ ]/) : null;
		const parens = sub ? ` (${subMain ? `${sub}, ` : ''}${main})` : '';
		return message.channel.send(`The current time in ${subMain || sub || main}${parens} is ${time}.`);
          }
          }
          });
			 

	}
};