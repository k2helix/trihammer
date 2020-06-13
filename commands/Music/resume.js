module.exports = {
	name: 'resume',
	description: 'Quita la pausa de una canción.',
	execute(client, message) {
		
        const serverQueue = client.queue.get(message.guild.id)
        if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.client.dispatcher.resume();
			return message.channel.send('▶');
		}
		return message.channel.send('Nothing playing now');
}
}