import Command from '../../lib/structures/Command';
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ColorResolvable,
	ComponentType,
	ModalActionRowComponentBuilder,
	ModalBuilder,
	ModalSubmitInteraction,
	TextInputBuilder,
	TextInputStyle
} from 'discord.js';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';

const JOIN_TIME = 20000;

interface Chicken {
	owner: string;
	name: string;
	health: number;
}

function sleep(ms: number) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

function generateMovement(participants: Chicken[], util: LanguageFile['util']) {
	const moves = Object.keys(util.cf.game) as (keyof typeof util.cf.game)[];
	const alive = participants.filter((c) => c.health > 0);

	let c1: Chicken | undefined;
	let c2: Chicken | undefined;
	let c3: Chicken | undefined;
	let roundMsg: string;
	let color: ColorResolvable;
	let losers: Chicken[] = [];

	let move = moves[Math.floor(Math.random() * moves.length)];
	if (alive.length <= 2 && move.startsWith('combined')) move = moves[0];

	if (move.startsWith('attack') || move.startsWith('both')) {
		c1 = alive[Math.floor(Math.random() * alive.length)];
		c2 = alive.filter((c) => c.owner !== c1!.owner)[Math.floor(Math.random() * (alive.length - 1))];

		c2.health--;
		if (move.startsWith('both')) c1.health--;
		color = 'Orange';
		roundMsg = util.cf.game[move as 'attack1'](c1, c2);
	} else if (move.startsWith('heal')) {
		c1 = alive[Math.floor(Math.random() * alive.length)];

		c1.health++;
		color = 'Green';
		roundMsg = util.cf.game[move as 'heal1'](c1);
	} else {
		c1 = alive[Math.floor(Math.random() * alive.length)];
		c2 = alive.filter((c) => c.owner !== c1!.owner)[Math.floor(Math.random() * (alive.length - 1))];
		c3 = alive.filter((c) => c.owner !== c1!.owner && c.owner !== c2!.owner)[Math.floor(Math.random() * (alive.length - 2))];

		c3.health--;
		color = 'Blue';
		roundMsg = util.cf.game[move as 'combined1'](c1, c2, c3);
	}

	if (c1 && c1.health <= 0) losers.push(c1);
	if (c2 && c2.health <= 0) losers.push(c2);
	if (c3 && c3.health <= 0) losers.push(c3);

	return { msg: roundMsg, color: color, end: participants.filter((c) => c.health > 0).length <= 1, losers: losers };
}

export default new Command({
	name: 'cockfight',
	description: 'Play cock fight with friends',
	category: 'fun',
	async execute(client, interaction, guildConf) {
		const { util } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		const userParticipants: string[] = [];
		const participants: Chicken[] = [];

		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(new ButtonBuilder().setCustomId('join-cf').setLabel(util.cf.button).setStyle(ButtonStyle.Primary));
		let msg = await interaction.channel!.send({ embeds: [client.lightBlueEmbed(util.cf.description).setTitle(util.cf.cf)], components: [row] });
		interaction.reply({ embeds: [client.blueEmbed(util.cf.starting)], ephemeral: true });

		const closesAt = Date.now() + JOIN_TIME;
		const collector = msg.createMessageComponentCollector({ time: JOIN_TIME, componentType: ComponentType.Button });
		collector.on('collect', async (reaction) => {
			let cock = {
				owner: reaction.user.username,
				name: util.cf.default_name(reaction.user.username),
				health: 2
			};

			userParticipants.push(reaction.user.username);
			msg.edit({
				embeds: [
					client
						.lightBlueEmbed(util.cf.description)
						.setTitle(util.cf.cf)
						.addFields({
							name: util.cf.list,
							value: userParticipants.map((u) => `${u}`).join('\n')
						})
				]
			});

			const modal = new ModalBuilder().setCustomId('cf-join').setTitle(util.cf.cf);
			const titleInput = new TextInputBuilder().setCustomId('cf-name').setLabel(util.cf.name).setStyle(TextInputStyle.Short).setRequired(true).setMaxLength(256);
			const firstActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(titleInput);
			modal.addComponents(firstActionRow);

			await reaction.showModal(modal);

			const filter = (int: ModalSubmitInteraction) => int.customId === 'cf-join' && int.user.id === reaction.user.id;
			reaction
				.awaitModalSubmit({ filter, time: closesAt - Date.now() })
				.then((int: ModalSubmitInteraction) => {
					cock.name = int.fields.getTextInputValue('cf-name');
					int.reply({ embeds: [client.blueEmbed(util.cf.joined)], ephemeral: true });
				})
				.catch(() => false);
			participants.push(cock);
		});
		collector.on('end', async (collected) => {
			if (collected.size < 2 || participants.length < 2) {
				msg.delete();
				return interaction.channel!.send({ embeds: [client.redEmbed(util.cf.no_participants)] });
			}

			msg.edit({
				embeds: [
					client
						.lightBlueEmbed(util.cf.description)
						.setTitle(util.cf.cf)
						.addFields({
							name: util.cf.list,
							value: participants.map((c) => `- **${c.owner}**: ${c.name}`).join('\n')
						})
				],
				components: []
			});

			await sleep(1000);
			interaction.channel!.send({ embeds: [client.lightBlueEmbed(util.cf.starting)] });
			await sleep(3000);

			let roundInfo = generateMovement(participants, util);
			interaction.channel!.send({ embeds: [client.blackEmbed(util.cf.first_round + ' ' + roundInfo.msg).setColor(roundInfo.color)] });

			do {
				await sleep(5000);
				roundInfo = generateMovement(participants, util);
				interaction.channel!.send({ embeds: [client.blackEmbed(roundInfo.msg).setColor(roundInfo.color)] });

				await sleep(1000);
				roundInfo.losers.forEach((c) => {
					interaction.channel!.send({ embeds: [client.redEmbed(util.cf.chicken_lost(c))] });
				});
			} while (!roundInfo.end);

			await sleep(3000);
			let winner = participants.find((c) => c.health > 0);

			if (!winner) interaction.channel!.send({ embeds: [client.lightBlueEmbed(util.cf.draw)] });
			else interaction.channel!.send({ embeds: [client.lightBlueEmbed(util.cf.winner(winner))] });
		});
	}
});
