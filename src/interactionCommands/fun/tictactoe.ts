import { Message, TextBasedChannel, User } from 'discord.js';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import Command from '../../lib/structures/Command';

const player1Emoji = '❌';
const player2Emoji = '🔵';
const noEmoji = '<:blank:848220685709213717>';

type board = [(string | null)[], (string | null)[], (string | null)[]];

function displayBoard(board: board) {
	return board
		.map((row) =>
			row
				.map((piece) => {
					if (piece === 'user') return player1Emoji;
					if (piece === 'oppo') return player2Emoji;
					return noEmoji;
				})
				.join('')
		)
		.join('\n');
}
async function verify(channel: TextBasedChannel, user: User, { time = 30000, yes = ['yes'], no = ['no'] } = {}) {
	const filter = (res: Message) => {
		const value = res.content.toLowerCase();
		return (user ? res.author.id === user.id : true) && (yes.includes(value) || no.includes(value));
	};
	const verify = await channel.awaitMessages({
		filter,
		max: 1,
		time
	});
	if (!verify.size) return 0;
	const choice = verify.first()!.content.toLowerCase();
	if (yes.includes(choice)) return true;
	if (no.includes(choice)) return false;
	return false;
}
function checkWinner(board: board) {
	const allEqual = (arr: (null | string)[]) => arr.every((v) => v === arr[0]);
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
function checkDraw(board: board) {
	let completedColumns = [];
	for (let index = 0; index < board.length; index++) {
		const column = board[index];
		if (column.every((v) => v !== null)) completedColumns.push(`column${index}`);
		if (completedColumns.length === 3) return 'draw';
	}
	return null;
}
// eslint-disable-next-line @typescript-eslint/no-var-requires
const db = require('megadb');
let tttdb = new db.crearDB('tictactoe');
export default new Command({
	name: 'tictactoe',
	description: 'Play tic tac toe with a friend',
	category: 'fun',
	async execute(client, interaction, guildConf) {
		if (!interaction.isChatInputCommand() && !interaction.isContextMenuCommand()) return;

		//@ts-ignore
		const opponent = interaction.options.getUser('user');
		if (!opponent) return;

		if (tttdb.has(`${interaction.user.id}&${opponent.id}`)) return interaction.reply({ embeds: [client.redEmbed('Seems like you are already playing.')], ephemeral: true });
		const { util } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		if (opponent.bot) return interaction.reply({ embeds: [client.redEmbed(`<@${interaction.user.id}>, ` + util.connect4.bot)], ephemeral: true });
		if (opponent.id === interaction.user.id && opponent.id !== '461279654158925825')
			return interaction.reply({ embeds: [client.redEmbed(util.invalid_user)], ephemeral: true });

		interaction.channel!.send(`<@${opponent.id}>` + util.connect4.challenge);
		interaction.reply({ embeds: [client.orangeEmbed(util.connect4.waiting)], ephemeral: true });

		const verification = await verify(interaction.channel!, opponent);
		if (!verification) return interaction.editReply({ embeds: [client.redEmbed(util.connect4.unverified)] });
		interaction.editReply({ embeds: [client.blueEmbed(util.connect4.success)] });

		let board: board = [
			[null, null, null],
			[null, null, null],
			[null, null, null]
		];
		let winner = null;
		let turn = 'user';
		let user = interaction.user;

		interaction.channel!.send(util.connect4.tictactoe);
		let msg = await interaction.channel!.send(displayBoard(board));
		tttdb.set(`${interaction.user.id}&${opponent.id}`, msg.id);
		while (!winner) {
			if (turn === 'user') user = interaction.user;
			else user = opponent;
			const filter = (res: Message) => res.author.id === user!.id;
			const response = await interaction.channel!.awaitMessages({
				filter,
				max: 1,
				time: 60000
			});
			if (!response.size) {
				tttdb.delete(`${interaction.user.id}&${opponent.id}`);
				winner = turn === 'user' ? 'oppo' : 'user';
				return interaction.channel!.send(`${util.connect4.win}${winner === 'oppo' ? opponent.username : interaction.user.username}` + '!');
			}
			let move = response.first()!.content.split(' ');
			let column = parseInt(move[0]) - 1;
			let row = parseInt(move[1]) - 1;
			if (!board[column]) continue;
			if (board[column][row] === undefined) continue;
			if (board[column][row]) continue;

			board[column][row] = turn;
			msg.edit(displayBoard(board));
			turn = turn === 'user' ? 'oppo' : 'user';
			winner = checkWinner(board);
			if (!winner) winner = checkDraw(board);
			if (winner) {
				if (winner === 'draw') interaction.channel!.send(util.connect4.draw);
				else interaction.channel!.send(`${util.connect4.win}${winner === 'oppo' ? opponent.username : interaction.user.username}` + '!');
				tttdb.delete(`${interaction.user.id}&${opponent.id}`);
			}
			response.first()!.delete();
		}
	}
});
