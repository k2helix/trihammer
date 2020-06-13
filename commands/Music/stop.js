const db = require('megadb')
const bsonDB = require('bsondb')
module.exports = {
	name: 'stop',
	description: 'Haz que el bot salga del canal de voz',
	aliases: ['st'],
	async execute(client, message) {
		
		
		const serverQueue = client.queue.get(message.guild.id)
		const voiceChannel = message.member.voice.channel;
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
						if (!voiceChannel) return message.channel.send('No estás en un canal de voz');
						if (!serverQueue) return message.channel.send('No hay nada para parar ahora mismo');
						serverQueue.songs = [];
						serverQueue.voiceChannel.leave();
						client.queue.delete(message.guild.id);
						console.log ("Stop command has been used.")
						return;
					} else if(langcode === "en") {
						if (!voiceChannel) return message.channel.send('You are not in a voice channel');
						if (!serverQueue) return message.channel.send('Nothing to stop right now.');
						serverQueue.songs = [];
						serverQueue.voiceChannel.leave();
						client.queue.delete(message.guild.id);
						console.log ("Stop command has been used.")
				  }
				  }
				});
     
  }
};
