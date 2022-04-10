const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'server',
	description: 'Server information',
	ESdesc: 'Información del servidor',
	usage: 'serverinfo [icon]',
	example: 'serverinfo icon\nserverinfo',
	aliases: ['serverinfo', 'server-info'],
	type: 0,
	async execute(client, interaction, guildConf) {
		// let region = {
		// 	brazil: ':flag_br: Brazil',
		// 	'eu-central': ':flag_eu: Central Europe',
		// 	singapore: ':flag_sg: Singapore',
		// 	'us-central': ':flag_us: US Central',
		// 	sydney: ':flag_au: Sydney',
		// 	'us-east': ':flag_us: US East',
		// 	'us-south': ':flag_us: US South',
		// 	'us-west': ':flag_us: US West',
		// 	'eu-west': ':flag_eu: West Europe',
		// 	'vip-us-east': ':flag_us: VIP US East',
		// 	london: ':flag_gb: London',
		// 	amsterdam: ':flag_nl: Amsterdam',
		// 	hongkong: ':flag_hk: Hong Kong',
		// 	russia: ':flag_ru: Russia',
		// 	southafrica: ':flag_za:  South Africa',
		// 	japan: ':flag_jp:  Japan (best region in the world)',
		// 	india: ':flag_in: India',
		// 	uswest: ':flag_eu: US West',
		// 	europe: ':flag_eu: Europe',
		// 	uscentral: ':flag_us: US Central',
		// 	ussouth: ':flag_us: US South',
		// 	useast: ':flag_us: US East'
		// };

		let { util } = require(`../../lib/utils/lang/${guildConf.lang}`);
		let guild = interaction.guild;
		guild.owner = await guild.fetchOwner();
		let serverembed = new MessageEmbed()
			.setTitle(guild.name)
			.setColor('RANDOM')
			.setThumbnail(guild.iconURL({ dynamic: true }))
			.addField('🆔 ID:', `${guild.id}`, false)
			.addField(util.server.owner, `${guild.owner ? guild.owner.user.tag : '???'} - ${guild.owner ? guild.owner.user.id : '¿id?'}`, false)
			.addField(util.server.createdString, util.server.created(guild), false)
			.addField(util.server.members, `${guild.memberCount} (${guild.members.cache.filter((m) => m.user.bot).size} bots)`, false);
		// .addField(util.server.region, region[guild.region], false);

		interaction.reply({ embeds: [serverembed] });
	}
};
