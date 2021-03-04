module.exports = {
	name: 'setcolor',
	description: 'Ponte un color',
	ESdesc: 'Ponte un color',
	aliases: ['color', 'clr'],
	type: -1,
	async execute(client, message, args) {
		if (message.guild.id !== '810627565060227152') return;
		if (!args[0]) return message.delete({ timeout: 5000 });
		args[0] = args[0].toLowerCase();

		let colors = {
			rojo: 'RED',
			azul: 'BLUE',
			verde: 'GREEN',
			amarillo: 'YELLOW',
			naranja: 'ORANGE',
			negro: 'BLACK',
			morado: 'PURPLE',
			blurple: 'BLURPLE',
			gris: 'GREY',
			random: 'RANDOM'
		};
		if (!colors[args[0]] && !args[0].startsWith('#')) return message.delete({ timeout: 5000 });
		let color = colors[args[0]] || args[0];
		let role = message.guild.roles.cache.find((r) => r.name === `Color de ${message.author.username}`);

		if (!role) {
			role = await message.guild.roles.create({
				data: {
					name: `Color de ${message.author.username}`,
					color: color
				},
				reason: 'Quiere un color'
			});
			message.member.roles.add(role).then(async () => {
				let sentMessage = await message.channel.send('Ok, te cambié el color a `' + color + '`, no cambies el nombre del rol.');
				sentMessage.delete({ timeout: 10000 });
				message.delete({ timeout: 7000 });
			});
		} else {
			role.setColor(color);
			let sentMessage = await message.channel.send('Ok, te cambié el color a `' + color + '`, no cambies el nombre del rol.');
			sentMessage.delete({ timeout: 10000 });
			message.delete({ timeout: 7000 });
		}
	}
};
