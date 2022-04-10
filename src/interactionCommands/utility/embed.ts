/* eslint-disable no-case-declarations */
const { MessageEmbed, Permissions } = require('discord.js');
module.exports = {
	name: 'embed',
	description: 'Make an [embed](https://phodit.net/embedbuilder/)',
	ESdesc: 'Haz un [embed](https://phodit.net/embedbuilder/)',
	usage: 'embed [channel] <embed>',
	example:
		'embed {\n"color": 0,\n"title": "title",\n"description": "description"\n}\nembed title: embed title | fields: [{"name": "field 1 name", "value": "field 1 value"}, {"name": "field 2 name", "value": "field 2 value", inline: true}] | footer: embed footer | description: embed description | color: #hex | image: url | thumbnail: url',
	aliases: ['makembed', 'createembed', 'makeembed', 'creatembed'],
	type: 2,
	execute(client, interaction, guildConf) {
		const { config } = require(`../../lib/utils/lang/${guildConf.lang}`);
		let permiso = guildConf.modrole !== 'none' ? interaction.member.roles.cache.has(guildConf.modrole) : interaction.member.permissions.has(Permissions.FLAGS.MANAGE_WEBHOOKS);
		let adminperms =
			guildConf.adminrole !== 'none' ? interaction.member.roles.cache.has(guildConf.adminrole) : interaction.member.permissions.has(Permissions.FLAGS.MANAGE_WEBHOOKS);
		if (!permiso && !adminperms) return interaction.reply({ content: config.mod_perm, ephemeral: true });
		interaction.reply({ content: ':thumbsup:', ephemeral: true });

		if (interaction.options.getString('json')) return interaction.channel.send(new MessageEmbed(JSON.parse(interaction.options.getString('json'))));
		let embed = new MessageEmbed();
		if (interaction.options.getString('title')) embed.setTitle(interaction.options.getString('title'));
		if (interaction.options.getString('description')) embed.setDescription(interaction.options.getString('description'));
		if (interaction.options.getString('footer')) embed.setFooter({ text: interaction.options.getString('footer') });
		if (interaction.options.getString('thumbnail')) embed.setThumbnail(interaction.options.getString('thumbnail'));
		if (interaction.options.getString('image')) embed.setImage(interaction.options.getString('image'));
		if (interaction.options.getString('color')) embed.setColor(interaction.options.getString('color'));
		if (interaction.options.getString('field-title-1'))
			embed.addField(interaction.options.getString('field-title-1'), interaction.options.getString('field-content-1') || '** **');
		if (interaction.options.getString('field-title-2'))
			embed.addField(interaction.options.getString('field-title-2'), interaction.options.getString('field-content-2') || '** **');
		if (interaction.options.getString('field-title-3'))
			embed.addField(interaction.options.getString('field-title-3'), interaction.options.getString('field-content-3') || '** **');

		interaction.channel.send({ embeds: [embed] });
	}
};
