/* eslint-disable no-case-declarations */
import { ColorResolvable, MessageEmbed, Permissions, TextBasedChannel } from 'discord.js';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import MessageCommand from '../../lib/structures/MessageCommand';
export default new MessageCommand({
	name: 'embed',
	description: 'Create an [embed](https://phodit.net/embedbuilder/)',
	category: 'utility',
	required_args: [
		{ index: 0, name: 'channel', type: 'channel', optional: true },
		{ index: 1, name: 'embed', type: 'string' }
	],
	async execute(client, message, args, guildConf) {
		const { config, mod } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

		let perms = guildConf.modrole !== 'none' ? message.member!.roles.cache.has(guildConf.modrole) : message.member!.permissions.has(Permissions.FLAGS.MANAGE_WEBHOOKS);
		let adminPerms =
			guildConf.adminrole !== 'none' ? message.member!.roles.cache.has(guildConf.adminrole) : message.member!.permissions.has(Permissions.FLAGS.MANAGE_WEBHOOKS);
		if (!perms && !adminPerms) return message.channel.send({ embeds: [client.redEmbed(config.mod_perm)] });

		if (args[0] === 'help') return message.channel.send({ embeds: [client.whiteEmbed(mod.embed.how_it_works)] });

		let embed = args.slice(1).join(' ');
		let channel = message.mentions.channels.first() || message.guild!.channels.cache.get(args[0]);
		if (!channel) {
			embed = args.join(' ');
			channel = message.channel;
		}
		if (!embed) return message.channel.send({ embeds: [client.redEmbed(mod.embed.embed_code)] });
		try {
			(channel as TextBasedChannel).send({ embeds: [new MessageEmbed(JSON.parse(embed))] });
		} catch (err) {
			try {
				// no me creo que yo hiciera tal obra de ingeniería, pero aquí estoy reescribiéndola y me parece increíble
				let cmd = args.join(' ');

				type value = 'title:' | 'description:' | 'fields:' | 'footer:' | 'thumbnail:' | 'image:' | 'color:';
				let array: value[] = ['title:', 'description:', 'fields:', 'footer:', 'thumbnail:', 'image:', 'color:'];
				let indexObject: { 'title:': number; 'description:': number; 'fields:': number; 'footer:': number; 'thumbnail:': number; 'image:': number; 'color:': number } = {
					'title:': 0,
					'description:': 0,
					'fields:': 0,
					'footer:': 0,
					'thumbnail:': 0,
					'image:': 0,
					'color:': 0
				};
				array.forEach((tag) => {
					indexObject[tag] = cmd.indexOf(tag);
				});
				let sorted = Object.keys(indexObject).sort(function (a, b) {
					return indexObject[b as value] - indexObject[a as value];
				});
				console.log(sorted);
				let customEmbed = new MessageEmbed();
				let contains = sorted.filter((v) => indexObject[v as value] > -1);
				contains.forEach((y) => {
					let prop = y as value;
					let tag = y.replace(':', '');
					let nextIndex = indexObject[sorted[sorted.indexOf(prop) - 1] as value];
					let end = nextIndex ? nextIndex - 2 : undefined;
					switch (tag) {
						case 'title':
							let title = cmd.slice(indexObject[prop] + y.length, end);
							customEmbed.setTitle(title);
							break;
						case 'description':
							let description = cmd.slice(indexObject[prop] + y.length, end);
							customEmbed.setDescription(description);
							break;
						case 'fields':
							let fields = cmd.slice(indexObject[prop] + y.length, end);
							customEmbed.addFields(JSON.parse(fields.replace(/\[|\]|/gi, '')));
							break;
						case 'footer':
							let footer = cmd.slice(indexObject[prop] + y.length, end);
							customEmbed.setFooter({ text: footer });
							break;
						case 'thumbnail':
							let thumbnail = cmd.slice(indexObject[prop] + y.length, end);
							customEmbed.setThumbnail(thumbnail);
							break;
						case 'image':
							let image = cmd.slice(indexObject[prop] + y.length, end);
							customEmbed.setImage(image);
							break;
						case 'color':
							let color = cmd.slice(indexObject[prop] + y.length, end);
							customEmbed.setColor(color as ColorResolvable);
							break;
					}
				});
				message.channel.send({ embeds: [customEmbed] });
			} catch (error) {
				console.error(error);
				message.channel.send((error as Error).message + mod.embed.create_embed);
			}
		}
	}
});
