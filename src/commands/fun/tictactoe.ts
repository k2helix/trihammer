import { GuildMember, Message, TextBasedChannel } from 'discord.js';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';

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
async function verify(channel: TextBasedChannel, user: GuildMember, { time = 30000, yes = ['yes'], no = ['no'] } = {}) {
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
export default new MessageCommand({
	name: 'tictactoe',
	description: 'Play tic tac toe with a friend',
	aliases: ['3enraya', 'tresenraya'],
	category: 'fun',
	async execute(client, message, args, guildConf) {
		const opponent = message.mentions.members!.first() || message.guild!.members.cache.get(args[0]);
		if (!opponent) return;

		if (tttdb.has(`${message.author.id}&${opponent.user.id}`)) return message.channel.send({ embeds: [client.redEmbed('Seems like you are already playing.')] });
		const { util } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		if (opponent.user.bot) return message.channel.send(`<@${message.author.id}>, ` + util.connect4.bot);
		if (opponent.id === message.author.id && opponent.id !== '461279654158925825') return;
		message.channel.send(opponent.user.username + util.connect4.challenge);
		const verification = await verify(message.channel, opponent);
		if (!verification) return message.channel.send(util.connect4.unverified);

		let board: board = [
			[null, null, null],
			[null, null, null],
			[null, null, null]
		];
		let winner = null;
		let turn = 'user';
		let user = message.member;

		message.channel.send(util.connect4.tictactoe);
		let msg = await message.channel.send(displayBoard(board));
		tttdb.set(`${message.author.id}&${opponent.user.id}`, msg.id);
		while (!winner) {
			if (turn === 'user') user = message.member;
			else user = opponent;
			const filter = (res: Message) => res.author.id === user!.id;
			const response = await message.channel.awaitMessages({
				filter,
				max: 1,
				time: 60000
			});
			if (!response.size) {
				tttdb.delete(`${message.author.id}&${opponent.user.id}`);
				winner = turn === 'user' ? 'oppo' : 'user';
				return message.channel.send(winner);
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
				if (winner === 'draw') message.channel.send(util.connect4.draw);
				else message.channel.send(`${util.connect4.win}${winner === 'oppo' ? opponent.user.username : message.author.username}` + '!');
				tttdb.delete(`${message.author.id}&${opponent.id}`);
			}
			response.first()!.delete();
		}
	}
});
