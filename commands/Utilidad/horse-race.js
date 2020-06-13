
const Discord = require('discord.js')
const bsonDB = require('bsondb')
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const { stripIndents } = require('common-tags');
function formatTime(time) {
		const min = Math.floor(time / 60);
		const sec = Math.floor(time - (min * 60));
		const ms = time - sec - (min * 60);
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
const horses =   
[
	{
		"name": "Johnny Lightning",
		"minTime": 95
	},
	{
		"name": "Superbee",
		"minTime": 116
	},
	{
		"name": "Arrrrr",
		"minTime": 135
	},
	{
		"name": "Covfefe",
		"minTime": 105
	},
	{
		"name": "Donald Trump",
		"minTime": 1800
	},
	{
		"name": "Doremifasolatido",
		"minTime": 106
	},
	{
		"name": "Elver Gacorta",
		"minTime": 108
	},
	{
		"name": "Sea Biscuit",
		"minTime": 115
	},
	{
		"name": "Big John",
		"minTime": 137
	},
	{
		"name": "Burgoo King",
		"minTime": 126
	},
	{
		"name": "Small John",
		"minTime": 140
	},
	{
		"name": "Naruto",
		"minTime": 121
	},
	{
		"name": "Michael",
		"minTime": 124
	},
	{
		"name": "I am a Donkey",
		"minTime": 101
	},
	{
		"name": "Rainbow Dash",
		"minTime": 100
	},
	{
		"name": "Twilight Sparkle",
		"minTime": 130
	},
	{
		"name": "Pinkie Pie",
		"minTime": 121
	},
	{
		"name": "Applejack",
		"minTime": 105
	},
	{
		"name": "Rarity",
		"minTime": 108
	},
	{
		"name": "Fluttershy",
		"minTime": 120
	},
	{
		"name": "Trixie",
		"minTime": 142
	},
	{
		"name": "Vert Wheeler",
		"minTime": 122
	},
	{
		"name": "Invite Xiao",
		"minTime": 127
	},
	{
		"name": "Mystery",
		"minTime": 126
	},
	{
		"name": "Dr. Fager",
		"minTime": 114
	},
	{
		"name": "Fiftyshadesofhay",
		"minTime": 144
	},
	{
		"name": "Dr. Pepper",
		"minTime": 104
	},
	{
		"name": "First Dude",
		"minTime": 104
	},
	{
		"name": "Flat Drunk",
		"minTime": 134
	},
	{
		"name": "Flat Fleet Feet",
		"minTime": 111
	},
	{
		"name": "Santa's Little Helper",
		"minTime": 144
	},
	{
		"name": "Whirlwind",
		"minTime": 110
	},
	{
		"name": "Harass",
		"minTime": 141
	},
	{
		"name": "Hoof Hearted",
		"minTime": 143
	},
	{
		"name": "I'll Have Another",
		"minTime": 114
	},
	{
		"name": "John Henry",
		"minTime": 115
	},
	{
		"name": "Notacatbutallama",
		"minTime": 141
	},
	{
		"name": "Larry the Cucumber",
		"minTime": 105
	},
	{
		"name": "Bob the Tomato",
		"minTime": 134
	},
	{
		"name": "Onoitsmymothernlaw",
		"minTime": 116
	},
	{
		"name": "Panty Raid",
		"minTime": 123
	},
	{
		"name": "Yakahickamickadola",
		"minTime": 113
	},
	{
		"name": "Last Place",
		"minTime": 119
	},
	{
		"name": "Luke Horsewalker",
		"minTime": 108
	},
	{
		"name": "Willy",
		"minTime": 144
	},
	{
		"name": "Don't Pick Me",
		"minTime": 115
	},
	{
		"name": "Spirit",
		"minTime": 98
	},
	{
		"name": "Jackbox",
		"minTime": 123
	},
	{
		"name": "Emporer Horseitine",
		"minTime": 113
	},
	{
		"name": "Darth Horse",
		"minTime": 136
	},
	{
		"name": "Jar-Jar Hooves",
		"minTime": 110
	},
	{
		"name": "Hoarse",
		"minTime": 123
	},
	{
		"name": "Dragon Fire",
		"minTime": 960
	},
	{
		"name": "Long Face",
		"minTime": 143
	},
	{
		"name": "Pony Up",
		"minTime": 142
	},
	{
		"name": "Magic of Friendship",
		"minTime": 106
	},
	{
		"name": "Help My Jockey Fell",
		"minTime": 120
	},
	{
		"name": "Lemon",
		"minTime": 115
	},
	{
		"name": "Calvin Johnson",
		"minTime": 138
	},
	{
		"name": "Rando Cardrissian",
		"minTime": 118
	},
	{
		"name": "Ocean Cookie",
		"minTime": 117
	},
	{
		"name": "Mistered",
		"minTime": 121
	},
	{
		"name": "Peggy Sue's",
		"minTime": 142
	},
	{
		"name": "Pickle Rick",
		"minTime": 115
	},
	{
		"name": "Nolo",
		"minTime": 118
	},
	{
		"name": "Mare N' Go",
		"minTime": 108
	},
	{
		"name": "Sgt. Wreck Less",
		"minTime": 144
	},
	{
		"name": "Daytona",
		"minTime": 136
	},
	{
		"name": "Wild Horse",
		"minTime": 100
	},
	{
		"name": "Sent Ore",
		"minTime": 124
	},
	{
		"name": "Gogoat",
		"minTime": 116
	},
	{
		"name": "Snail Male",
		"minTime": 132
	},
	{
		"name": "D'apples are Sweet",
		"minTime": 134
	},
	{
		"name": "Neighkid",
		"minTime": 107
	},
	{
		"name": "Neighsayer",
		"minTime": 120
	},
	{
		"name": "Dee Canter",
		"minTime": 128
	},
	{
		"name": "Mustang",
		"minTime": 121
	},
	{
		"name": "Rocket",
		"minTime": 132
	},
	{
		"name": "What the Buck",
		"minTime": 136
	},
	{
		"name": "Just Mare-ied",
		"minTime": 124
	},
	{
		"name": "Kolt Kardashian",
		"minTime": 105
	},
	{
		"name": "Rogue One",
		"minTime": 121
	},
	{
		"name": "Eat Pant",
		"minTime": 128
	},
	{
		"name": "Rapidash",
		"minTime": 102
	},
	{
		"name": "Vicente",
		"minTime": 99
	}
]

module.exports = {
	name: 'horse-race',
	description: '',
  aliases: ['horse', 'horserace'],
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
          async function generateLeaderboard (chosenHorses, results) {
		const lb = await loadImage(langcode === "es" ? 'https://cdn.discordapp.com/attachments/487962590887149603/714123875549446144/leaderboard.png' : 'https://cdn.discordapp.com/attachments/487962590887149603/714123824743972924/enleaderboard.png');
		const horseImg = await loadImage('https://github.com/dragonfire535/xiao/blob/master/assets/images/horse-race/horse.png?raw=true');
		const canvas = createCanvas(lb.width, lb.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(lb, 0, 0);
		ctx.fillStyle = 'white';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		for (let i = 0; i < results.length; i++) {
			const result = results[i];
			const horse = chosenHorses.find(hor => hor.name === result.name);
			if (colors[i]) drawImageWithTint(ctx, horseImg, colors[i], 37, 114 + (49 * i), 49, 49);
			ctx.font = '34px Paladins';
			ctx.fillText(formatTime(result.time), 755, 138 + (49 * i));
			ctx.font = '15px Paladins';
			ctx.fillText(horse.name, 251, 138 + (49 * i));
		}
		return { attachment: canvas.toBuffer(), name: 'leaderboard.png' };
	}
          
          if(langcode === "es") {
            const chosenHorses = shuffle(horses).slice(0, 6);
		await message.reply(stripIndents`
			**escoge un caballo al que apostar:** _(Escribe el número)_
			${chosenHorses.map((horse, i) => `**${i + 1}.** ${horse.name}`).join('\n')}
		`);
		const filter = res => {
			if (res.author.id !== message.author.id) return false;
			const num = Number.parseInt(res.content, 10);
			if (!num) return false;
			return num > 0 && num <= chosenHorses.length;
		};
		const msgs = await message.channel.awaitMessages(filter, {
			max: 1,
			time: 30000
		});
		if (!msgs.size) return message.reply('lo siento, no puede iniciar una carrera sin apuestas.');
		const pick = chosenHorses[Number.parseInt(msgs.first().content, 10) - 1];
		let results = [];
		for (const horse of chosenHorses) {
			results.push({
				name: horse.name,
				time: randomRange(horse.minTime, horse.minTime + 5) + Math.random()
			});
		}
		results = results.sort((a, b) => a.time - b.time);
		const leaderboard = await generateLeaderboard(chosenHorses, results);
		const win = results[0].name === pick.name;
		return message.reply(win ? `felicidades, ¡has ganado!` : 'mejor suerte la próxima vez...', { files: [leaderboard] });
          } else if(langcode === "en") {
            const chosenHorses = shuffle(horses).slice(0, 6);
		await message.reply(stripIndents`
			**choose a horse to bet on:** _(Type the number)_
			${chosenHorses.map((horse, i) => `**${i + 1}.** ${horse.name}`).join('\n')}
		`);
		const filter = res => {
			if (res.author.id !== message.author.id) return false;
			const num = Number.parseInt(res.content, 10);
			if (!num) return false;
			return num > 0 && num <= chosenHorses.length;
		};
		const msgs = await message.channel.awaitMessages(filter, {
			max: 1,
			time: 30000
		});
		if (!msgs.size) return message.reply('sorry, can\'t have a race with no bets!');
		const pick = chosenHorses[Number.parseInt(msgs.first().content, 10) - 1];
		let results = [];
		for (const horse of chosenHorses) {
			results.push({
				name: horse.name,
				time: randomRange(horse.minTime, horse.minTime + 5) + Math.random()
			});
		}
		results = results.sort((a, b) => a.time - b.time);
		const leaderboard = await generateLeaderboard(chosenHorses, results);
		const win = results[0].name === pick.name;
		return message.reply(win ? `nice job! Your horse won!` : 'better luck next time!', { files: [leaderboard] });
          }
          }
          });
			 

	}
};