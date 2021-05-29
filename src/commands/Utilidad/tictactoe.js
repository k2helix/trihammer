/* eslint-disable no-unused-vars */
const playerOneEmoji = '❌';
const playerTwoEmoji = '🔵';
const blankEmoji = '<:blank:848220685709213717>';

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
function checkWinner(board) {
	const allEqual = (arr) => arr.every((v) => v === arr[0]);
	for (let index = 0; index < board.length; index++) {
		const column = board[index];
		if (allEqual(column)) return column[0];
	}
	if (board[0][0] === board[1][0] && board[0][0] === board[2][0]) return board[0][0];
	if (board[0][1] === board[1][1] && board[0][1] === board[2][1]) return board[0][1];
	if (board[0][2] === board[1][2] && board[0][2] === board[2][2]) return board[0][2];
	//diagonal
	if (board[0][0] === board[1][1] && board[0][0] === board[2][2]) return board[0][0];
	if (board[0][2] === board[1][1] && board[0][2] === board[2][0]) return board[0][2];
	return null;
}
const db = require('megadb');
let tttdb = new db.crearDB('tictactoe');
const { ModelServer } = require('../../utils/models');
module.exports = {
	name: 'tictactoe',
	description: 'Play tic tac toe with a friend',
	ESdesc: 'Juega tic tac toe con un amigo',
	aliases: ['3enraya', 'tresenraya'],
	type: 0,
	async execute(client, message, args) {
		const opponent = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
		if (!opponent) return;

		if (tttdb.has(`${message.author.id}&${opponent.user.id}`)) return message.channel.send('Seems like you are already playing.');
		let serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
		const langcode = serverConfig.lang;
		let { util } = require(`../../utils/lang/${langcode}.js`);

		if (opponent.user.bot) return message.reply(util.connect4.bot);
		if (opponent.id === message.author.id && opponent.id !== '461279654158925825') return;
		message.channel.send(opponent.user.username + util.connect4.challenge);
		const verification = await verify(message.channel, opponent);
		if (!verification) return message.channel.send(util.connect4.unverified);

		let board = [
			[null, null, null],
			[null, null, null],
			[null, null, null]
		];
		let winner = null;
		let turn = 'user';
		let user = message.member;

		let msg = await message.channel.send(displayBoard(board));
		tttdb.set(`${message.author.id}&${opponent.user.id}`, msg.id);
		while (!winner) {
			if (turn === 'user') user = message.member;
			else user = opponent;
			const filter = (res) => res.author.id === user.id;
			const response = await message.channel.awaitMessages(filter, {
				max: 1,
				time: 60000
			});
			let move = response.first().content.split(' ');
			let column = move[0] - 1;
			let row = move[1] - 1;
			if (!board[column]) continue;
			if (board[column][row] === undefined) continue;
			if (board[column][row]) continue;

			board[column][row] = turn;
			msg.edit(displayBoard(board));
			turn = turn === 'user' ? 'oppo' : 'user';
			winner = checkWinner(board);
			if (winner) {
				message.channel.send(winner);
				tttdb.delete(`${message.author.id}&${opponent.user.id}`);
			}
			response.first().delete({ timeout: 1000 });
		}
	}
};
