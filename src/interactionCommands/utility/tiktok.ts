// @ts-nocheck
import MessageCommand from '../../lib/structures/Command';
import request from 'node-superfetch';
import { load } from 'cheerio';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ChatInputCommandInteraction, ComponentType, TextChannel } from 'discord.js';
export default new MessageCommand({
	name: 'tiktok',
	description: 'Search for someone in TikTok',
	category: 'utility',
	async execute(client, interaction, guildConf) {
		try {
			let { text } = await request.get('https://proxitok.herokuapp.com/@' + (interaction as ChatInputCommandInteraction).options.getString('user'));
			let $ = load(text as string);
			let posts = $('div[class="media-content"]');
			let videoSources = posts.find('source');
			let postsContent = posts.find('div[class="content"]');
			let postsArray: {
				video: string;
				shortened_video: string | null | undefined;
				main_comment: string | null;
				date: string;
				views: string;
				likes: string;
				comments: string;
				index: number;
			}[] = [];
			for (let index = 0; index < postsContent.length; index++) {
				const content = postsContent[index];
				let valuableChildren = content.children.filter((ch) => ch.children);

				let nameAndDateParagraph = valuableChildren[0];
				// let tagsParagraph = valuableChildren.find((ch) => ch.children[0].attribs && ch.children[0].attribs.class === 'tags');
				let mainCommentParagraph = valuableChildren.find((ch) => ch.children.length === 1);
				let interactionsParagraph = valuableChildren[valuableChildren.length - 1];

				let date = nameAndDateParagraph.children.find((ch: { name: string; attribs: { title: string } }) => ch.name === 'small' && ch.attribs.title).attribs.title;

				let mainComment = mainCommentParagraph ? mainCommentParagraph.children[0].data : null;

				let interactions = interactionsParagraph.children.filter((ch: { attribs: { class: string } }) => ch.attribs && ch.attribs.class === 'icon-text');
				let views = interactions[0].children.filter((ch: { name: string }) => ch.name === 'span')[1].children[0].data;
				let likes = interactions[1].children.filter((ch: { name: string }) => ch.name === 'span')[1].children[0].data;
				let comments = interactions[2].children.filter((ch: { name: string }) => ch.name === 'span')[1].children[0].data;

				postsArray.push({
					video: videoSources[index].attribs.src.slice(12),
					shortened_video: null,
					main_comment: mainComment,
					date: date,
					views: views,
					likes: likes,
					comments: comments,
					index: index
				});
			}

			const { util } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

			let currentPost = postsArray[0];
			currentPost.shortened_video = (await request.get('https://is.gd/create.php?format=simple&url=' + currentPost.video).catch(() => null))?.text;

			const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
				new ButtonBuilder().setCustomId('dobleleft').setEmoji({ id: '882631909442744350' }).setStyle(ButtonStyle.Primary),
				new ButtonBuilder().setCustomId('left').setEmoji({ id: '882626242459861042' }).setStyle(ButtonStyle.Primary),
				new ButtonBuilder().setCustomId('right').setEmoji({ id: '882626290253959258' }).setStyle(ButtonStyle.Primary),
				new ButtonBuilder().setCustomId('dobleright').setEmoji({ id: '882631788550324295' }).setStyle(ButtonStyle.Primary),
				new ButtonBuilder().setCustomId('crossx').setEmoji({ id: '882639143874723932' }).setStyle(ButtonStyle.Danger)
			]);
			interaction.reply({
				content: client.replaceEach(util.tiktok, {
					'{user}': `@${(interaction as ChatInputCommandInteraction).options.getString('user')}`,
					'{videoUrl}': currentPost.shortened_video || currentPost.video,
					'{mainComment}': currentPost.main_comment || '',
					'{likes}': currentPost.likes,
					'{views}': currentPost.views,
					'{comments}': currentPost.comments,
					'{current}': (currentPost.index + 1).toString(),
					'{total}': postsArray.length.toString()
				}),
				components: [row]
			});
			let msg = await interaction.fetchReply();

			const filter = (int: ButtonInteraction) => int.user.id === interaction.user.id;
			const collector = msg.createMessageComponentCollector({ filter, time: 300000, componentType: ComponentType.Button });
			collector.on('collect', async (int) => {
				let currentIndex = currentPost.index;
				switch (int.customId) {
					case 'dobleleft':
						currentPost = postsArray[currentIndex - 10] || postsArray[0];
						if (!currentPost.shortened_video)
							currentPost.shortened_video = (await request.get('https://is.gd/create.php?format=simple&url=' + currentPost.video).catch(() => null))?.text;
						int.update(
							client.replaceEach(util.tiktok, {
								'{user}': `@${(interaction as ChatInputCommandInteraction).options.getString('user')}`,
								'{videoUrl}': currentPost.shortened_video || currentPost.video,
								'{mainComment}': currentPost.main_comment || '',
								'{likes}': currentPost.likes,
								'{views}': currentPost.views,
								'{comments}': currentPost.comments,
								'{current}': (currentPost.index + 1).toString(),
								'{total}': postsArray.length.toString()
							})
						);
						break;
					case 'left':
						currentPost = postsArray[currentIndex - 1] || postsArray[postsArray.length - 1];
						if (!currentPost.shortened_video)
							currentPost.shortened_video = (await request.get('https://is.gd/create.php?format=simple&url=' + currentPost.video).catch(() => null))?.text;
						int.update(
							client.replaceEach(util.tiktok, {
								'{user}': `@${(interaction as ChatInputCommandInteraction).options.getString('user')}`,
								'{videoUrl}': currentPost.shortened_video || currentPost.video,
								'{mainComment}': currentPost.main_comment || '',
								'{likes}': currentPost.likes,
								'{views}': currentPost.views,
								'{comments}': currentPost.comments,
								'{current}': (currentPost.index + 1).toString(),
								'{total}': postsArray.length.toString()
							})
						);
						break;
					case 'right':
						currentPost = postsArray[currentIndex + 1] || postsArray[0];
						if (!currentPost.shortened_video)
							currentPost.shortened_video = (await request.get('https://is.gd/create.php?format=simple&url=' + currentPost.video).catch(() => null))?.text;
						int.update(
							client.replaceEach(util.tiktok, {
								'{user}': `@${(interaction as ChatInputCommandInteraction).options.getString('user')}`,
								'{videoUrl}': currentPost.shortened_video || currentPost.video,
								'{mainComment}': currentPost.main_comment || '',
								'{likes}': currentPost.likes,
								'{views}': currentPost.views,
								'{comments}': currentPost.comments,
								'{current}': (currentPost.index + 1).toString(),
								'{total}': postsArray.length.toString()
							})
						);
						break;
					case 'dobleright':
						if (!currentPost.shortened_video)
							currentPost.shortened_video = (await request.get('https://is.gd/create.php?format=simple&url=' + currentPost.video).catch(() => null))?.text;
						currentPost = postsArray[currentIndex + 10] || postsArray[postsArray.length - 1];
						int.update(
							client.replaceEach(util.tiktok, {
								'{user}': `@${(interaction as ChatInputCommandInteraction).options.getString('user')}`,
								'{videoUrl}': currentPost.shortened_video || currentPost.video,
								'{mainComment}': currentPost.main_comment || '',
								'{likes}': currentPost.likes,
								'{views}': currentPost.views,
								'{comments}': currentPost.comments,
								'{current}': (currentPost.index + 1).toString(),
								'{total}': postsArray.length.toString()
							})
						);
						break;
					case 'crossx':
						int.update({ components: [] });
						break;
				}
			});

			collector.on('end', () => {
				msg.edit({ components: [] });
			});
		} catch (err) {
			client.catchError(err, interaction.channel as TextChannel);
		}
	}
});
