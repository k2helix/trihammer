import MessageCommand from '../../lib/structures/MessageCommand';

const blankEmoji = '⚪️';
const playerOneEmoji = '🔴';
const playerTwoEmoji = '🟡';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const db = require('megadb');
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import { GuildMember, Message, TextBasedChannel } from 'discord.js';
let c4db = new db.crearDB('connect4');
const nums = [':one:', ':two:', ':three:', ':four:', ':five:', ':six:', ':seven:'];
type board = [(string | null)[], (string | null)[], (string | null)[], (string | null)[], (string | null)[], (string | null)[], (string | null)[]];
function checkLine(a: string | null, b: string | null, c: string | null, d: string | null) {
	return a !== null && a === b && a === c && a === d;
}

function verifyWin(bd: board) {
	for (let r = 0; r < 3; r++) for (let c = 0; c < 7; c++) if (checkLine(bd[r][c], bd[r + 1][c], bd[r + 2][c], bd[r + 3][c])) return bd[r][c];

	for (let r = 0; r < 6; r++) for (let c = 0; c < 4; c++) if (checkLine(bd[r][c], bd[r][c + 1], bd[r][c + 2], bd[r][c + 3])) return bd[r][c];

	for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) if (checkLine(bd[r][c], bd[r + 1][c + 1], bd[r + 2][c + 2], bd[r + 3][c + 3])) return bd[r][c];

	for (let r = 3; r < 6; r++) for (let c = 0; c < 4; c++) if (checkLine(bd[r][c], bd[r - 1][c + 1], bd[r - 2][c + 2], bd[r - 3][c + 3])) return bd[r][c];

	return null;
}

function generateBoard() {
	const arr = [];
	for (let i = 0; i < 6; i++) arr.push([null, null, null, null, null, null, null]);

	return arr as board;
}

function displayBoard(board: board) {
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

export default new MessageCommand({
	name: 'connect4',
	description: 'Play connect 4 with a friend',
	aliases: ['connectfour', 'connect-four', 'c4'],
	category: 'fun',
	required_args: [{ index: 0, type: 'member', name: 'user' }],
	client_perms: ['ManageMessages'],
	async execute(client, message, args, guildConf) {
		const opponent = message.mentions.members!.first() || message.guild!.members.cache.get(args[0]);
		if (!opponent) return;

		if (c4db.has(`${message.author.id}&${opponent.user.id}`)) return message.channel.send({ embeds: [client.redEmbed('Seems like you are already playing.')] });
		const { util } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		if (opponent.user.bot) return message.channel.send({ embeds: [client.redEmbed(`<@${message.author.id}>, ` + util.connect4.bot)] });
		if (opponent.id === message.author.id && opponent.id !== '461279654158925825') return message.channel.send({ embeds: [client.redEmbed(util.invalid_user)] });
		message.channel.send(`<@${opponent.user.id}>` + util.connect4.challenge);
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
			if (!c4db.has(`${message.author.id}&${opponent.user.id}`)) {
				let msg = await message.channel.send(`${user}` + util.connect4.column + `\n${displayBoard(board)}\n${nums.join('')}`);
				c4db.set(`${message.author.id}&${opponent.user.id}`, msg.id);
			} else {
				let msg = await c4db.obtener(`${message.author.id}&${opponent.user.id}`);
				let fetchedMsg = await message.channel.messages.fetch(msg);
				fetchedMsg.edit(`${user}` + util.connect4.column + `\n${displayBoard(board)}\n${nums.join('')}`);
			}

			const filter = (res: Message) => {
				if (res.author.id !== user.id) return false;
				const choice = res.content;
				if (choice.toLowerCase() === 'end') return true;
				const i = Number.parseInt(choice, 10) - 1;
				return board[colLevels[i]] && board[colLevels[i]][i] !== undefined;
			};
			const turn = await message.channel.awaitMessages({
				filter,
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
			const choice = turn.first()!.content;
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
			turn.first()!.delete();
		}

		// eslint-disable-next-line prettier/prettier
		if (winner === 'time') message.channel.send(util.connect4.inactivity);
		else {
			message.channel.send(winner ? util.connect4.win + `${winner}!` : util.connect4.draw);
			let msgDB = await c4db.obtener(`${message.author.id}&${opponent.user.id}`);
			let msg = await message.channel.messages.fetch(msgDB);
			msg.edit(`${displayBoard(board)}\n${nums.join('')}`);
		}
		c4db.delete(`${message.author.id}&${opponent.user.id}`);
	}
});
