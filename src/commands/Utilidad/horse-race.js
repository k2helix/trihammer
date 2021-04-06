const { createCanvas, loadImage } = require('canvas');

const { stripIndents } = require('common-tags');
function formatTime(time) {
	const min = Math.floor(time / 60);
	const sec = Math.floor(time - min * 60);
	const ms = time - sec - min * 60;
	return `${min}:${sec.toString().padStart(2, '0')}.${ms.toFixed(4).slice(2)}`;
}

const colors = ['gold', 'silver', '#cd7f32'];
function shuffle(array) {
	const arr = array.slice(0);
	for (let i = arr.length - 1; i >= 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const temp = arr[i];
		arr[i] = arr[j];
		arr[j] = temp;
	}
	return arr;
}
function randomRange(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
function drawImageWithTint(ctx, image, color, x, y, width, height) {
	const { fillStyle, globalAlpha } = ctx;
	ctx.fillStyle = color;
	ctx.drawImage(image, x, y, width, height);
	ctx.globalAlpha = 0.5;
	ctx.fillRect(x, y, width, height);
	ctx.fillStyle = fillStyle;
	ctx.globalAlpha = globalAlpha;
}

const { horses } = require('../../utils/obj/objects');
const { ModelServer } = require('../../utils/models');
module.exports = {
	name: 'horse-race',
	description: 'Play some horse races',
	ESdesc: 'Juega algunas carreras de caballos',
	usage: 'horse-race',
	example: 'horse-race',
	aliases: ['horse', 'horserace'],
	type: 7,
	myPerms: [true, 'ATTACH_FILES'],
	async execute(client, message) {
		const serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
		let langcode = serverConfig.lang;
		let { util } = require(`../../utils/lang/${langcode}.js`);
		async function generateLeaderboard(chosenHorses, results) {
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
				ctx.fillText(horse.name, 251, 138 + 49 * i);
			}
			return { attachment: canvas.toBuffer(), name: 'leaderboard.png' };
		}

		const chosenHorses = shuffle(horses).slice(0, 6);
		await message.reply(stripIndents`
		${util.horse_race.choose_horse}
			${chosenHorses.map((horse, i) => `**${i + 1}.** ${horse.name}`).join('\n')}
		`);
		const filter = (res) => {
			if (res.author.id !== message.author.id) return false;
			const num = Number.parseInt(res.content, 10);
			if (!num) return false;
			return num > 0 && num <= chosenHorses.length;
		};
		const msgs = await message.channel.awaitMessages(filter, {
			max: 1,
			time: 30000
		});
		if (!msgs.size) return message.reply(util.horse_race.no_bets);
		const pick = chosenHorses[Number.parseInt(msgs.first().content, 10) - 1];
		let results = [];
		for (const horse of chosenHorses)
			results.push({
				name: horse.name,
				time: randomRange(horse.minTime, horse.minTime + 5) + Math.random()
			});

		results = results.sort((a, b) => a.time - b.time);
		const leaderboard = await generateLeaderboard(chosenHorses, results);
		const win = results[0].name === pick.name;
		return message.reply(win ? util.horse_race.win : util.horse_race.lose, { files: [leaderboard] });
	}
};
