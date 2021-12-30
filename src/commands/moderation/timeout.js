const { MessageEmbed, Permissions } = require('discord.js');
const { ModelServer } = require('../../utils/models');
module.exports = {
	name: 'timeout',
	description: 'Timeout a member',
	ESdesc: 'Aisla a un usuario temporalmente',
	usage: 'timeout <member> <duration || 0> [reason]',
	example: 'timeout @uwu 1h me cae mal\ntimeout @uwu 0 unmuted',
	myPerms: [false, 'MODERATE_MEMBERS'],
	type: 2,
	async execute(client, message, args) {
		const guildConf = await ModelServer.findOne({ server: message.guild.id }).lean();
		let { mod, functions, config } = require(`../../utils/lang/${guildConf.lang}.js`);
		let permiso = guildConf.modrole !== 'none' ? message.member.roles.cache.has(guildConf.modrole) : message.member.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS);
		let adminperms = guildConf.adminrole !== 'none' ? message.member.roles.cache.has(guildConf.adminrole) : message.member.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS);
		if (!permiso && !adminperms) return message.channel.send({ content: config.mod_perm });

		let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]),
			time = functions.Convert(args[1]),
			reason = args.slice(2).join(' ') || 'No reason';
		if (!member) return message.channel.send(mod.need_id);
		if (!member.moderatable) return message.channel.send(mod.not_moderatable);
		if (!args[1]) return message.channel.send(mod.time_404);

		if (args[1].startsWith('0')) {
			let unmuteEmbed = new MessageEmbed().setColor('RANDOM').setDescription(mod.timeout.clear.replace('{member}', member.user.tag));
			member.timeout(null, (reason || 'No reason') + ` | by ${message.author.tag}`);
			return message.channel.send({ embeds: [unmuteEmbed] });
		} else if (member.isCommunicationDisabled()) return message.channel.send({ content: mod.timeout.already_timed_out, ephemeral: true });

		if (!time) return message.channel.send(mod.time_404);
		if (time.tiempo >= 2419200000) return message.channel.send({ content: mod.timeout.time });

		let embed = new MessageEmbed().setColor('RANDOM').setDescription(
			mod.timeout.timeout.replaceAll({
				'{member}': member.user.tag,
				'{duration}': time.nombre,
				'{reason}': reason || 'No'
			})
		);
		member.timeout(time.tiempo, (reason || 'No reason') + ` | by ${message.author.tag}`);
		message.channel.send({ embeds: [embed] });
	}
};
