const { MessageEmbed } = require('discord.js');
const { ModelServer } = require('../../utils/models');
module.exports = {
	name: 'serverinfo',
	description: 'Server information',
	ESdesc: 'Información del servidor',
	usage: 'serverinfo [icon]',
	example: 'serverinfo icon\nserverinfo',
	aliases: ['server', 'server-info'],
	type: 0,
	async execute(client, message, args) {
		let region = {
			brazil: ':flag_br: Brazil',
			'eu-central': ':flag_eu: Central Europe',
			singapore: ':flag_sg: Singapore',
			'us-central': ':flag_us: US Central',
			sydney: ':flag_au: Sydney',
			'us-east': ':flag_us: US East',
			'us-south': ':flag_us: US South',
			'us-west': ':flag_us: US West',
			'eu-west': ':flag_eu: West Europe',
			'vip-us-east': ':flag_us: VIP US East',
			london: ':flag_gb: London',
			amsterdam: ':flag_nl: Amsterdam',
			hongkong: ':flag_hk: Hong Kong',
			russia: ':flag_ru: Russia',
			southafrica: ':flag_za:  South Africa',
			japan: ':flag_jp:  Japan (best region in the world)',
			india: ':flag_in: India',
			uswest: ':flag_eu: US West',
			europe: ':flag_eu: Europe',
			uscentral: ':flag_us: US Central',
			ussouth: ':flag_us: US South',
			useast: ':flag_us: US East'
		};

		const serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
		let langcode = serverConfig.lang;
		let { util } = require(`../../utils/lang/${langcode}.js`);

		let guild = message.guild;

		if (!isNaN(args[0])) guild = client.guilds.cache.get(args[0]);
		if (args[0] === 'icon') return message.channel.send(guild.iconURL({ dynamic: true, format: 'png', size: 1024 }));

		if (!guild) return message.channel.send(':x: No encontré el servidor');
		guild.owner = await guild.fetchOwner();
		let serverembed = new MessageEmbed()
			.setTitle(guild.name)
			.setColor('RANDOM')
			.setThumbnail(guild.iconURL({ dynamic: true }))
			.addField('🆔 ID:', `${guild.id}`, false)
			.addField(util.server.owner, `${guild.owner ? guild.owner.user.tag : '???'} - ${guild.owner ? guild.owner.user.id : '¿id?'}`, false)
			.addField(util.server.createdString, util.server.created(guild), false)
			.addField(util.server.members, `${guild.memberCount} (${guild.members.cache.filter((m) => m.user.bot).size} bots)`, false)
			.addField(util.server.region, region[guild.region], false);

		message.channel.send({ embeds: [serverembed] });
	}
};
