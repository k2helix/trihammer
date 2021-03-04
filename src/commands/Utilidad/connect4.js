const { stripIndents } = require('common-tags');
const blankEmoji = '⚪️';
const playerOneEmoji = '🔴';
const playerTwoEmoji = '🟡';
const db = require('megadb');
let c4db = new db.crearDB('connect4');
const nums = [':one:', ':two:', ':three:', ':four:', ':five:', ':six:', ':seven:'];
function checkLine(a, b, c, d) {
	return a !== null && a === b && a === c && a === d;
}

function verifyWin(bd) {
	for (let r = 0; r < 3; r++) for (let c = 0; c < 7; c++) if (checkLine(bd[r][c], bd[r + 1][c], bd[r + 2][c], bd[r + 3][c])) return bd[r][c];

	for (let r = 0; r < 6; r++) for (let c = 0; c < 4; c++) if (checkLine(bd[r][c], bd[r][c + 1], bd[r][c + 2], bd[r][c + 3])) return bd[r][c];

	for (let r = 0; r < 3; r++)
		for (let c = 0; c < 4; c++) if (checkLine(bd[r][c], bd[r + 1][c + 1], bd[r + 2][c + 2], bd[r + 3][c + 3])) return bd[r][c];

	for (let r = 3; r < 6; r++)
		for (let c = 0; c < 4; c++) if (checkLine(bd[r][c], bd[r - 1][c + 1], bd[r - 2][c + 2], bd[r - 3][c + 3])) return bd[r][c];

	return null;
}

function generateBoard() {
	const arr = [];
	for (let i = 0; i < 6; i++) arr.push([null, null, null, null, null, null, null]);

	return arr;
}

function displayBoard(board) {
	return board
		.map((row) =>
			row
				.map((piece) => {
					if (piece === 'user') return playerOneEmoji;
					if (piece === 'oppo') return playerTwoEmoji;
					return blankEmoji;
				})
				.join('')
		)
		.join('\n');
}
async function verify(channel, user, { time = 30000, yes = ['yes'], no = ['no'] } = {}) {
	const filter = (res) => {
		const value = res.content.toLowerCase();
		return (user ? res.author.id === user.id : true) && (yes.includes(value) || no.includes(value));
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

const { ModelServer } = require('../../utils/models');
module.exports = {
	name: 'connect4',
	description: 'Play connect 4 with a friend',
	ESdesc: 'Juega conecta 4 con un amigo',
	usage: 'connect4 <friend>',
	example: 'connect4 @user',
	aliases: ['connectfour', 'connect-four', 'c4'],
	type: 7,
	myPerms: [true, 'MANAGE_MESSAGES'],
	async execute(client, message, args) {
		const opponent = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
		if (!opponent) return;

		if (c4db.has(message.channel.id)) return;
		let serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
		const langcode = serverConfig.lang;
		let { util } = require(`../../utils/lang/${langcode}.js`);

		if (opponent.user.bot) return message.reply(util.connect4.bot);
		if (opponent.id === message.author.id && opponent.id !== '461279654158925825') return;
		message.channel.send(opponent.user.username + util.connect4.challenge);
		const verification = await verify(message.channel, opponent);
		if (!verification) return message.channel.send(util.connect4.unverified);

		const board = generateBoard();
		let userTurn = true;
		let winner = null;
		const colLevels = [5, 5, 5, 5, 5, 5, 5];
		let lastTurnTimeout = false;
		while (!winner && board.some((row) => row.includes(null))) {
			const user = userTurn ? message.author : opponent;
			const sign = userTurn ? 'user' : 'oppo';
			if (!c4db.has(message.channel.id)) {
				let mensaje = await message.channel.send(
					stripIndents`
					${user}` +
						util.connect4.column +
						`\n${displayBoard(board)}\n${nums.join('')}`
				);
				c4db.set(message.channel.id, mensaje.id);
			} else {
				let mensage = await c4db.obtener(message.channel.id);
				let mensaje = await message.channel.messages.fetch(mensage);
				mensaje.edit(
					stripIndents`
					${user}` +
						util.connect4.column +
						`\n${displayBoard(board)}\n${nums.join('')}`
				);
			}

			const filter = (res) => {
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
				await message.channel.send(util.connect4.timeout);
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
			turn.first().delete({ timeout: 1000 });
		}

		if (winner === 'time') return message.channel.send('Partida finalizada por inactividad') && c4db.delete(message.channel.id);
		message.channel.send(winner ? util.connect4.win + `${winner}!` : util.connect4.draw);
		let msgDB = await c4db.obtener(message.channel.id);
		let msg = await message.channel.messages.fetch(msgDB);
		msg.edit(stripIndents`${displayBoard(board)}\n${nums.join('')}`);
		c4db.delete(message.channel.id);
	}
};
