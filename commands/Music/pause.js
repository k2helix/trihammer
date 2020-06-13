module.exports = {
	name: 'pause',
	description: 'Pausa una canción',
	execute(client, message) {
		
        const serverQueue = client.queue.get(message.guild.id)
        if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.client.dispatcher.pause();
			return message.channel.send('⏸');
		
 }
 return message.channel.send('Nothing playing now');
}
}