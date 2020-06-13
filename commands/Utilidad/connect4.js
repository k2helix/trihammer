
const Discord = require('discord.js')
const moment = require('moment-timezone');
const bsonDB = require('bsondb')
const { stripIndents } = require('common-tags');
const blankEmoji = '⚪️';
const playerOneEmoji = '🔴';
const playerTwoEmoji = '🟡';
const db = require('megadb')
let c4db = new db.crearDB('connect4')
const nums = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣'];
function checkLine(a, b, c, d) {
		return (a !== null) && (a === b) && (a === c) && (a === d);
	}

	function verifyWin(bd) {
		for (let r = 0; r < 3; r++) {
			for (let c = 0; c < 7; c++) {
				if (checkLine(bd[r][c], bd[r + 1][c], bd[r + 2][c], bd[r + 3][c])) return bd[r][c];
			}
		}
		for (let r = 0; r < 6; r++) {
			for (let c = 0; c < 4; c++) {
				if (checkLine(bd[r][c], bd[r][c + 1], bd[r][c + 2], bd[r][c + 3])) return bd[r][c];
			}
		}
		for (let r = 0; r < 3; r++) {
			for (let c = 0; c < 4; c++) {
				if (checkLine(bd[r][c], bd[r + 1][c + 1], bd[r + 2][c + 2], bd[r + 3][c + 3])) return bd[r][c];
			}
		}
		for (let r = 3; r < 6; r++) {
			for (let c = 0; c < 4; c++) {
				if (checkLine(bd[r][c], bd[r - 1][c + 1], bd[r - 2][c + 2], bd[r - 3][c + 3])) return bd[r][c];
			}
		}
		return null;
	}

	function generateBoard() {
		const arr = [];
		for (let i = 0; i < 6; i++) {
			arr.push([null, null, null, null, null, null, null]);
		}
		return arr;
	}

	function displayBoard(board) {
		return board.map(row => row.map(piece => {
			if (piece === 'user') return playerOneEmoji;
			if (piece === 'oppo') return playerTwoEmoji;
			return blankEmoji;
		}).join('')).join('\n');
	}
async function verify(channel, user, { time = 30000, yes = ['yes'], no = ['no'] } = {}) {
		const filter = res => {
			const value = res.content.toLowerCase();
			return (user ? res.author.id === user.id : true)
				&& (yes.includes(value) || no.includes(value) );
		};
		const verify = await channel.awaitMessages(filter, {
			max: 1,
			time
		});
		if (!verify.size) return 0;
		const choice = verify.first().content.toLowerCase();
		if (yes.includes(choice)) return true;
		if (no.includes(choice)) return false;
		return false;
	}
module.exports = {
	name: 'connect4',
	description: '',
  aliases: ['connectfour', 'connect-four'],
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
      const opponent = message.mentions.members.first() || message.guild.members.cache.get(args[0])
      if(!opponent) return
				  if (!datos1) {
				   return  
				  } else {
          let langcode = datos1.lang
          
          if(langcode === "es") {
            if (opponent.user.bot) return message.reply('no se puede jugar contra bots');
	        if(opponent.id === message.author.id) return
            message.channel.send(opponent.user.username + ', aceptas el desafío? (yes o no)')
            const verification = await verify(message.channel, opponent);
			if (!verification) {
				return message.channel.send('Parece que no ha aceptado... (tiene que decir yes o no)');
			}
			const board = generateBoard();
			let userTurn = true;
			let winner = null;
			const colLevels = [5, 5, 5, 5, 5, 5, 5];
			let lastTurnTimeout = false;
			while (!winner && board.some(row => row.includes(null))) {
				const user = userTurn ? message.author : opponent;
				const sign = userTurn ? 'user' : 'oppo';
        if(!c4db.has(message.channel.id)) {
          	let mensaje = await message.channel.send(stripIndents`
					${user}, qué columna eliges? Escribe \`end\` para finalizar.
					${displayBoard(board)}
					${nums.join('')}
				`);
          c4db.set(message.channel.id, mensaje.id)
        } else {
         let mensage = await c4db.obtener(message.channel.id)
         let mensaje = await message.channel.messages.fetch(mensage)
         mensaje.edit(stripIndents`
					${user}, qué columna eliges? Escribe \`end\` para finalizar.
					${displayBoard(board)}
					${nums.join('')}
				`);
        }

				const filter = res => {
					if (res.author.id !== user.id) return false;
					const choice = res.content;
					if (choice.toLowerCase() === 'end') return true;
					const i = Number.parseInt(choice, 10) - 1;
					return board[colLevels[i]] && board[colLevels[i]][i] !== undefined;
				};
				const turn = await message.channel.awaitMessages(filter, {
					max: 1,
					time: 60000
				});
        
				if (!turn.size) {
					await message.channel.send('Te quedaste sin tiempo...');
					if (lastTurnTimeout) {
						winner = 'time';
						break;
					} else {
						lastTurnTimeout = true;
						userTurn = !userTurn;
						continue;
					}
				}
				const choice = turn.first().content;
				if (choice.toLowerCase() === 'end') {
					winner = userTurn ? opponent : message.author;
					break;
				}
				const i = Number.parseInt(choice, 10) - 1;
				board[colLevels[i]][i] = sign;
				colLevels[i] -= 1;
				if (verifyWin(board)) winner = userTurn ? message.author : opponent;
				if (lastTurnTimeout) lastTurnTimeout = false;
				userTurn = !userTurn;
 
			}
			
			if (winner === 'time') return message.channel.send('Partida finalizada por inactividad') && c4db.delete(message.channel.id)
			return message.channel.send(winner ? `¡Felicidades, ${winner}!` : 'Parece que es un empate...') && c4db.delete(message.channel.id)
          } else if(langcode === "en") {
          if (opponent.bot) return message.reply('bots may not be played against.');
		if (opponent.id === message.author.id) return message.reply('you may not play against yourself.');
             message.channel.send(opponent + ', do you accept the challenge? (yes or no)')
            const verification = await verify(message.channel, opponent);
			if (!verification) {
				return message.channel.send('Looks like they declined...');
			}
			const board = generateBoard();
			let userTurn = true;
			let winner = null;
			const colLevels = [5, 5, 5, 5, 5, 5, 5];
			let lastTurnTimeout = false;
			while (!winner && board.some(row => row.includes(null))) {
				const user = userTurn ? message.author : opponent;
				const sign = userTurn ? 'user' : 'oppo';
				await message.channel.send(stripIndents`
					${user}, which column do you pick? Type \`end\` to forefeit.
					${displayBoard(board)}
					${nums.join('')}
				`);
        
        if(!c4db.has(message.channel.id)) {
          	let mensaje = await await message.channel.send(stripIndents`
					${user}, which column do you pick? Type \`end\` to forefeit.
					${displayBoard(board)}
					${nums.join('')}
				`);
          c4db.set(message.channel.id, mensaje.id)
        } else {
         let mensaje = await c4db.obtener(message.channel.id)
         mensaje.edit(stripIndents`
					${user}, which column do you pick? Type \`end\` to forefeit.
					${displayBoard(board)}
					${nums.join('')}
				`);
        }
				const filter = res => {
					if (res.author.id !== user.id) return false;
					const choice = res.content;
					if (choice.toLowerCase() === 'end') return true;
					const i = Number.parseInt(choice, 10) - 1;
					return board[colLevels[i]] && board[colLevels[i]][i] !== undefined;
				};
				const turn = await message.channel.awaitMessages(filter, {
					max: 1,
					time: 60000
				});
				if (!turn.size) {
					await message.say('Sorry, time is up!');
					if (lastTurnTimeout) {
						winner = 'time';
						break;
					} else {
						lastTurnTimeout = true;
						userTurn = !userTurn;
						continue;
					}
				}
				const choice = turn.first().content;
				if (choice.toLowerCase() === 'end') {
					winner = userTurn ? opponent : message.author;
					break;
				}
				const i = Number.parseInt(choice, 10) - 1;
				board[colLevels[i]][i] = sign;
				colLevels[i] -= 1;
				if (verifyWin(board)) winner = userTurn ? message.author : opponent;
				if (lastTurnTimeout) lastTurnTimeout = false;
				userTurn = !userTurn;
             turn.first().delete(1000)
			}
			
			if (winner === 'time') return message.channel.send('Game ended due to inactivity.') && c4db.delete(message.channel.id)
			return message.channel.send(winner ? `Congrats, ${winner}!` : 'Looks like it\'s a draw...') && c4db.delete(message.channel.id)
          }
          }
          });
			 

	}
};