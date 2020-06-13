const bsonDB = require('bsondb')
module.exports = {
	name: 'volume',
	description: 'volume set <volume>',
	aliases: ['v'],
	execute(client, message, args) {
		const serverQueue = client.queue.get(message.guild.id)
		if (!message.member.voice.channel) return message.channel.send('You are not in a voice channel');
		if (!serverQueue) return message.channel.send("There ins't songs in the queue right now.");
		if (!args[1]) return message.channel.send(`Volume: **${serverQueue.volume}**`);
		serverQueue.volume = args[1];
        serverQueue.connection.client.dispatcher.setVolumeLogarithmic(args[1] / 5);
        return message.channel.send(`I set the volume to **${args[1]}**`);
	}
};