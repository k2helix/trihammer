const lyrics = require('buscador-letra'); //Importar la libreria
const Discord = require('discord.js');
let searcher = new lyrics(process.env.GENIUS_API_KEY);

const { ModelServer } = require('../../utils/models');

module.exports = {
	name: 'lyrics',
	description: 'Get the lyrics of a song',
	ESdesc: 'Obtén la letra de una canción',
	usage: 'lyrics <song>',
	example: 'lyrics despacito',
	aliases: ['letra', 'lyr'],
	type: 6,
	async execute(client, message, args) {
		const serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
		let langcode = serverConfig.lang;
		const { music } = require(`../../utils/lang/${langcode}`);

		const name = args.join(' ');
		if (!name) return await message.channel.send(music.lyrics_name);
		const results = await searcher.buscar(name);
		if (results.length === 0) return await message.channel.send(music.not_found);
		const lyrics = await searcher.letra(results[0]);
		if (!lyrics) return await message.channel.send(music.not_found);

		const embed = new Discord.MessageEmbed().setColor('RANDOM').setTitle(results[0].titulo + ' (by ' + results[0].artista + ')');

		if (lyrics.length <= 2048) embed.setDescription(lyrics);
		else if (embed.length > 6000) return await message.channel.send(music.length);
		else {
			const chunks = lyrics.match(/[\s\S]{1,1023}/g);
			for (const chunk of chunks) embed.addField('\u200b', chunk, false);
		}

		return await message.channel.send(embed);
	}
};
