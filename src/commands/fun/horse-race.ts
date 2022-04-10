import { Image, NodeCanvasRenderingContext2D, createCanvas, loadImage } from 'canvas';

function formatTime(time: number) {
	const min = Math.floor(time / 60);
	const sec = Math.floor(time - min * 60);
	const ms = time - sec - min * 60;
	return `${min}:${sec.toString().padStart(2, '0')}.${ms.toFixed(4).slice(2)}`;
}

const colors = ['gold', 'silver', '#cd7f32'];
function shuffle(array: { name: string; minTime: number }[]) {
	const arr = array.slice(0);
	for (let i = arr.length - 1; i >= 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const temp = arr[i];
		arr[i] = arr[j];
		arr[j] = temp;
	}
	return arr;
}
function randomRange(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
function drawImageWithTint(ctx: NodeCanvasRenderingContext2D, image: Image, color: string, x: number, y: number, width: number, height: number) {
	const { fillStyle, globalAlpha } = ctx;
	ctx.fillStyle = color;
	ctx.drawImage(image, x, y, width, height);
	ctx.globalAlpha = 0.5;
	ctx.fillRect(x, y, width, height);
	ctx.fillStyle = fillStyle;
	ctx.globalAlpha = globalAlpha;
}

import { horses } from '../../lib/utils/objects';
import MessageCommand from '../../lib/structures/MessageCommand';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import { MessageActionRow, MessageEmbed, MessageSelectMenu, SelectMenuInteraction } from 'discord.js';
export default new MessageCommand({
	name: 'horse-race',
	description: 'Play some horse races',
	aliases: ['horse', 'horserace'],
	category: 'fun',
	client_perms: ['ATTACH_FILES'],
	async execute(client, message, _args, guildConf) {
		let { util } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;
		async function generateLeaderboard(chosenHorses: { name: string; minTime: number }[], results: { name: string; time: number }[]) {
			const lb = await loadImage(util.horse_race.img);
			const horseImg = await loadImage(
				'https://cdn.discordapp.com/attachments/487962590887149603/829043185552326666/57-570437_thoroughbred-the-kentucky-derby-horse-racing-equestrian-horse1.png'
			);
			const canvas = createCanvas(lb.width, lb.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(lb, 0, 0);
			ctx.fillStyle = 'white';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			for (let i = 0; i < results.length; i++) {
				const result = results[i];
				const horse = chosenHorses.find((hor) => hor.name === result.name);
				if (colors[i]) drawImageWithTint(ctx, horseImg, colors[i], 37, 114 + 49 * i, 49, 49);
				ctx.font = '34px sans-serif';
				ctx.fillText(formatTime(result.time), 755, 138 + 49 * i);
				ctx.font = '15px sans-serif';
				ctx.fillText(horse!.name, 251, 138 + 49 * i);
			}
			return { attachment: canvas.toBuffer(), name: 'leaderboard.png' };
		}

		const chosenHorses = shuffle(horses).slice(0, 6);
		let embed = new MessageEmbed()
			.setTitle(util.horse_race.title)
			.setDescription(util.horse_race.description)
			.addField(util.horse_race.list, chosenHorses.map((horse, i) => `**${i + 1}.** ${horse.name}`).join('\n'));

		let options = [];
		for (let index = 0; index < chosenHorses.length; index++) {
			const element = chosenHorses[index];
			options.push({ label: `${index + 1}- ${element.name}`, value: index.toString() });
		}
		const row = new MessageActionRow().addComponents(
			new MessageSelectMenu().setCustomId('horses').setPlaceholder(util.anime.nothing_selected).setMaxValues(1).addOptions(options)
		);

		let mainMessage = await message.channel.send({ embeds: [embed], components: [row] });
		let currentBets: { user: string; horse: string }[] = [];
		const filter = (int: SelectMenuInteraction) => int.customId === 'horses';
		const collector = await mainMessage.createMessageComponentCollector({ filter, time: 15000, componentType: 'SELECT_MENU' });

		collector.on('collect', (i) => {
			let selected = chosenHorses[parseInt(i.values[0])].name;
			let userBet = currentBets.find((bet) => bet.user === i.user.id);
			if (userBet) userBet.horse = selected;
			else currentBets.push({ user: i.user.id, horse: selected });
			let editedEmbed = new MessageEmbed()
				.setTitle(util.horse_race.title)
				.setDescription(util.horse_race.description)
				.addField(
					util.horse_race.list,
					chosenHorses
						.map(
							(horse, index) =>
								`**${index + 1}.** ${horse.name}: ${currentBets
									.filter((bet) => bet.horse === horse.name)
									.map((bet) => `<@${bet.user}>`)
									.join(', ')}`
						)
						.join('\n')
				);
			mainMessage.edit({ embeds: [editedEmbed] });
			i.reply({ embeds: [ client.blueEmbed(util.horse_race.selected) ], ephemeral: true });
		});
		//@ts-ignore
		collector.on('end', (collected) => {
			if (collected.size < 1) {
				mainMessage.delete();
				return message.channel.send({ embeds: [client.redEmbed(util.horse_race.no_bets)] });
			}
			mainMessage.edit({
				components: [],
				embeds: [new MessageEmbed().setImage('https://cdn.discordapp.com/attachments/487962590887149603/955132839500873778/horse-race.gif?size=4096')]
			});

			setTimeout(async () => {
				let results: { name: string; time: number }[] = [];
				for (const horse of chosenHorses)
					results.push({
						name: horse.name,
						time: randomRange(horse.minTime, horse.minTime + 5) + Math.random()
					});

				results = results.sort((a, b) => a.time - b.time);
				const leaderboard = await generateLeaderboard(chosenHorses, results);
				const winners = currentBets.filter((bet) => results[0].name === bet.horse);

				let finalEmbed = new MessageEmbed()
					.setColor('YELLOW')
					.setDescription(util.horse_race.win.replace('{users}', winners.map((winner) => `<@${winner.user}>`).join(', ') || 'no winners :('))
					.setImage('attachment://leaderboard.png');
				return mainMessage.edit({ embeds: [finalEmbed], files: [leaderboard] });
			}, 5000);
		});
	}
});
