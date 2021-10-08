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
	const verify = await channel.awaitMessages({
		filter,
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
function checkDraw(board) {
	let completedColumns = [];
	for (let index = 0; index < board.length; index++) {
		const column = board[index];
		if (column.every((v) => v !== null)) completedColumns.push(`column${index}`);
		if (completedColumns.length === 3) return 'draw';
	}
	return null;
}

const db = require('megadb');
let tttdb = new db.crearDB('tictactoe');
module.exports = {
	name: 'tictactoe',
	description: 'Play tic tac toe with a friend',
	ESdesc: 'Juega tic tac toe con un amigo',
	aliases: ['3enraya', 'tresenraya'],
	type: 7,
	myPerms: [true, 'MANAGE_MESSAGES', 'VIEW_CHANNEL', 'SEND_MESSAGES'],
	async execute(client, interaction, guildConf) {
		let { util } = require(`../../utils/lang/${guildConf.lang}.js`);
		const opponent = interaction.options.getUser('user');
		if (!opponent) return interaction.reply({ content: util.invalid_user, ephemeral: true });

		if (tttdb.has(`${interaction.user.id}&${opponent.id}`)) return interaction.reply({ content: 'Seems like you are already playing', ephemeral: true });

		if (opponent.bot) return interaction.reply({ content: `<@${interaction.user.id}>, ` + util.connect4.bot, ephemeral: true });
		if (opponent.id === interaction.user.id && opponent.id !== '461279654158925825') return interaction.reply({ content: util.invalid_user, ephemeral: true });

		interaction.channel.send(`<@${opponent.id}>` + util.connect4.challenge);
		interaction.reply({ content: util.connect4.waiting });
		const verification = await verify(interaction.channel, opponent);
		if (!verification) return interaction.editReply(util.connect4.unverified);
		interaction.editReply(util.connect4.success);

		let board = [
			[null, null, null],
			[null, null, null],
			[null, null, null]
		];
		let winner = null;
		let turn = 'user';
		let user = interaction.user;

		interaction.channel.send(util.connect4.tictactoe);
		let msg = await interaction.channel.send(displayBoard(board));
		tttdb.set(`${interaction.user.id}&${opponent.id}`, msg.id);
		while (!winner) {
			if (turn === 'user') user = interaction.user;
			else user = opponent;
			const filter = (res) => res.author.id === user.id;
			const response = await interaction.channel.awaitMessages({
				filter,
				max: 1,
				time: 60000
			});
			if (!response.size) {
				tttdb.delete(`${interaction.user.id}&${opponent.id}`);
				winner = turn === 'user' ? 'oppo' : 'user';
				return interaction.channel.send(util.connect4.inactivity);
			}
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
			if (!winner) winner = checkDraw(board);
			if (winner) {
				if (winner === 'draw') interaction.channel.send(util.connect4.draw);
				else interaction.channel.send(`${util.connect4.win}${winner === 'oppo' ? opponent.username : interaction.user.username}` + '!');
				tttdb.delete(`${interaction.user.id}&${opponent.id}`);
			}
			response.first().delete();
		}
	}
};
