/* eslint-disable no-case-declarations */
const { MessageEmbed } = require('discord.js');
String.prototype.getPosition = function (subString, index) {
	return this.split(subString, index).join(subString).length;
};
const { ModelServer } = require('../../utils/models');
module.exports = {
	name: 'embed',
	description: 'Make an [embed](https://phodit.net/embedbuilder/)',
	ESdesc: 'Haz un [embed](https://phodit.net/embedbuilder/)',
	usage: 'embed [channel] <embed>',
	example:
		'embed {\n"color": 0,\n"title": "title",\n"description": "description"\n}\nembed title: embed title | fields: [{"name": "field 1 name", "value": "field 1 value"}, {"name": "field 2 name", "value": "field 2 value", inline: true}] | footer: embed footer | description: embed description | color: #hex | image: url | thumbnail: url',
	aliases: ['makembed', 'createembed', 'makeembed', 'creatembed'],
	type: 2,
	async execute(client, message, args) {
		const serverConfig = await ModelServer.findOne({ server: message.guild.id }).lean();
		let langcode = serverConfig.lang;
		const { mod, config } = require(`../../utils/lang/${langcode}.js`);
		let permiso =
			serverConfig.modrole !== 'none' ? message.member.roles.cache.has(serverConfig.modrole) : message.member.hasPermission('MANAGE_WEBHOOKS');
		let adminperms =
			serverConfig.adminrole !== 'none' ? message.member.roles.cache.has(serverConfig.adminrole) : message.member.hasPermission('MANAGE_WEBHOOKS');
		if (!permiso && !adminperms) return message.channel.send(config.mod_perm);

		if (args[0] === 'help') return message.channel.send(mod.embed.how_it_works);

		let embed = args.slice(1).join(' ');
		let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
		if (!channel) (embed = args.join(' ')), (channel = message.channel);
		if (!embed) return message.channel.send(mod.embed.embed_code);
		try {
			channel.send(new MessageEmbed(JSON.parse(embed)));
		} catch (err) {
			try {
				let cmd = args.join(' ');

				let array = ['title:', '| description:', '| fields:', '| footer:', '| thumbnail:', '| image:', '| color:'];
				let obj = {};
				array.forEach((x) => {
					obj[x] = cmd.indexOf(x);
				});
				let sorted = Object.keys(obj).sort(function (a, b) {
					return obj[b] - obj[a];
				});
				let customEmbed = new MessageEmbed();
				let contains = sorted.filter((x) => obj[x] > -1);
				contains.forEach((y) => {
					let tag = y.replace(/\| |:|/gi, '');
					let end = obj[sorted[sorted.indexOf(y) - 1]];
					switch (tag) {
						case 'title':
							let title = cmd.slice(obj[y] + y.length, end);
							customEmbed.setTitle(title);
							break;
						case 'description':
							let description = cmd.slice(obj[y] + y.length, end);
							customEmbed.setDescription(description);
							break;
						case 'fields':
							let fields = cmd.slice(obj[y] + y.length, end);
							customEmbed.addFields(JSON.parse(fields.replace(/\[|\]|/gi, '')));
							break;
						case 'footer':
							let footer = cmd.slice(obj[y] + y.length, end);
							customEmbed.setFooter(footer);
							break;
						case 'thumbnail':
							let thumbnail = cmd.slice(obj[y] + y.length, end);
							customEmbed.setThumbnail(thumbnail);
							break;
						case 'image':
							let image = cmd.slice(obj[y] + y.length, end);
							customEmbed.setImage(image);
							break;
						case 'color':
							let color = cmd.slice(obj[y] + y.length, end);
							customEmbed.setColor(color);
							break;
					}
				});
				message.channel.send(customEmbed);
			} catch (error) {
				console.error(error);
				message.channel.send(error.message + mod.embed.create_embed);
			}
		}
	}
};
