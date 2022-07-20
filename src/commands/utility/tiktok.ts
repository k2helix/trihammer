// @ts-nocheck
import MessageCommand from '../../lib/structures/MessageCommand';
import request from 'node-superfetch';
import { load } from 'cheerio';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ComponentType, TextChannel } from 'discord.js';
interface post {
	itemInfos: {
		video: {
			urls: string[];
			shortened_video: string | null | undefined;
		};
		text: string | null;
		createTime: string;
		playCount: string;
		diggCount: string;
		commentCount: string;
		index: number;
	};
}
export default new MessageCommand({
	name: 'tiktok',
	description: 'Search for someone in TikTok',
	category: 'utility',
	required_args: [{ index: 0, name: 'username', type: 'string' }],
	async execute(client, message, args, guildConf) {
		let currentPost: post['itemInfos'];
		let postsData: post[];
		try {
			let instances = ['https://proxitok.herokuapp.com', 'https://proxitok.pussthecat.org', 'https://proxitok.privacydev.net'];
			let currentInstance = 0;
			do {
				let r = await request.get(`${instances[currentInstance]}/@${args[0]}`).catch(() => null);
				if (r?.status === 200) {
					let $ = load(r.text as string);
					let posts = $('div[class="media-content"]');
					let videoSources = posts.find('source');
					let postsContent = posts.find('div[class="content"]');
					postsData = [];
					for (let index = 0; index < postsContent.length; index++) {
						const content = postsContent[index];
						let valuableChildren = content.children.filter((ch) => ch.children);

						let nameAndDateParagraph = valuableChildren[0];
						// let tagsParagraph = valuableChildren.find((ch) => ch.children[0].attribs && ch.children[0].attribs.class === 'tags');
						let mainCommentParagraph = valuableChildren.find((ch) => ch.children.length === 1);
						let interactionsParagraph = valuableChildren[valuableChildren.length - 1];

						let date = nameAndDateParagraph.children.find((ch: { name: string; attribs: { title: string } }) => ch.name === 'small' && ch.attribs?.title)?.attribs.title;
						let mainComment = mainCommentParagraph ? mainCommentParagraph.children[0].data : null;
						let interactions = interactionsParagraph.children.filter((ch: { attribs: { class: string } }) => ch.attribs && ch.attribs.class === 'icon-text');
						let views = interactions[0].children.filter((ch: { name: string }) => ch.name === 'span')[1].children[0].data;
						let likes = interactions[1].children.filter((ch: { name: string }) => ch.name === 'span')[1].children[0].data;
						let comments = interactions[2].children.filter((ch: { name: string }) => ch.name === 'span')[1].children[0].data;

						postsData.push({
							itemInfos: {
								video: { urls: [videoSources[index].attribs.src.slice(12)], shortened_video: null },
								text: mainComment,
								createTime: date || '',
								playCount: views,
								diggCount: likes,
								commentCount: comments,
								index: index
							}
						});
					}
					currentPost = postsData[0]?.itemInfos;
				}
				currentInstance++;
			} while (!currentPost && currentInstance < instances.length);

			if (!currentPost && currentInstance === instances.length) {
				let { text } = await request.get(`https://www.tiktok.com/node/share/user/@${args[0]}?aid=1988`, {
					url: `https://www.tiktok.com/node/share/user/@${args[0]}?aid=1988`,
					headers: {
						'User-Agent': 'Mozilla/5.0 (Linux; U; Android 4.1.1; en-gb; Build/KLP) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30'
					}
				});
				let parsedResponse = JSON.parse(text!);
				if (parsedResponse.statusCode !== 0)
					return message.channel.send({
						embeds: [client.redEmbed(`[${parsedResponse.statusCode}] An error ocurred while getting the user id.\n${parsedResponse.statusMsg}`)]
					});
				let userData = parsedResponse.userInfo;
				let postsRequest = await request.get(
					`https://m.tiktok.com/share/item/list?type=1&cursor=0&minCursor=0&maxCursor=0` +
						`&id=${userData.user.id}` +
						`&count=${(50 * 6).toString()}` + // for some reason tiktok divides the requested count by 6
						`&_signature=_02B4Z6wo00f01dm7eCQAAIBDJ6yC3DDIHBXZq3SAABS723`,
					// @ts-ignore
					{
						headers: {
							'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4256.184 Safari/537.36',
							referer: 'https://www.tiktok.com/'
						}
					}
				);
				let parsedData = JSON.parse(postsRequest.text!);
				if (parsedData.statusCode !== 0)
					return message.channel.send({ embeds: [client.redEmbed(`[${parsedData.statusCode}] An error ocurred while getting user posts.\n${parsedData.errMsg}`)] });
				postsData = parsedData.body.itemListData;

				currentPost = postsData[0]?.itemInfos;
				if (currentPost) currentPost.index = 0;
			}

			const { util, music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

			if (!currentPost) return message.channel.send({ embeds: [client.redEmbed(music.not_found)] });
			currentPost.video.shortened_video = (await request.get('https://is.gd/create.php?format=simple&url=' + currentPost.video.urls[0]).catch(() => null))?.text;

			const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
				new ButtonBuilder().setCustomId('dobleleft').setEmoji({ id: '882631909442744350' }).setStyle(ButtonStyle.Primary),
				new ButtonBuilder().setCustomId('left').setEmoji({ id: '882626242459861042' }).setStyle(ButtonStyle.Primary),
				new ButtonBuilder().setCustomId('right').setEmoji({ id: '882626290253959258' }).setStyle(ButtonStyle.Primary),
				new ButtonBuilder().setCustomId('dobleright').setEmoji({ id: '882631788550324295' }).setStyle(ButtonStyle.Primary),
				new ButtonBuilder().setCustomId('crossx').setEmoji({ id: '882639143874723932' }).setStyle(ButtonStyle.Danger)
			]);
			let msg = await message.channel.send({
				content: client.replaceEach(util.tiktok, {
					'{user}': `@${args[0]}`,
					'{videoUrl}': currentPost.video.shortened_video || currentPost.video.urls[0],
					'{mainComment}': currentPost.text || '',
					'{likes}': currentPost.diggCount,
					'{views}': currentPost.playCount,
					'{comments}': currentPost.commentCount,
					'{current}': (currentPost.index + 1).toString(),
					'{total}': postsData.length.toString(),
					'{date}': currentPost.createTime.length === 10 ? `<t:${currentPost.createTime}>` : (currentPost.createTime as string)
				}),
				components: [row]
			});

			const filter = (int: ButtonInteraction) => int.user.id === message.author.id;
			const collector = msg.createMessageComponentCollector({ filter, time: 300000, componentType: ComponentType.Button });
			collector.on('collect', async (int) => {
				let currentIndex = currentPost.index;
				switch (int.customId) {
					case 'dobleleft':
						currentPost = postsData[currentIndex - 10]?.itemInfos || postsData[0].itemInfos;
						if (!currentPost.index) currentPost.index = postsData[currentIndex - 10] ? currentIndex - 10 : 0;
						if (!currentPost.video.shortened_video)
							currentPost.video.shortened_video = (await request.get('https://is.gd/create.php?format=simple&url=' + currentPost.video.urls[0]).catch(() => null))?.text;
						int.update(
							client.replaceEach(util.tiktok, {
								'{user}': `@${args[0]}`,
								'{videoUrl}': currentPost.video.shortened_video || currentPost.video.urls[0],
								'{mainComment}': currentPost.text || '',
								'{likes}': currentPost.diggCount,
								'{views}': currentPost.playCount,
								'{comments}': currentPost.commentCount,
								'{current}': (currentPost.index + 1).toString(),
								'{total}': postsData.length.toString(),
								'{date}': currentPost.createTime.length === 10 ? `<t:${currentPost.createTime}>` : (currentPost.createTime as string)
							})
						);
						break;
					case 'left':
						currentPost = postsData[currentIndex - 1]?.itemInfos || postsData[postsData.length - 1].itemInfos;
						if (!currentPost.index) currentPost.index = postsData[currentIndex - 1] ? currentIndex - 1 : postsData.length - 1;
						if (!currentPost.video.shortened_video)
							currentPost.video.shortened_video = (await request.get('https://is.gd/create.php?format=simple&url=' + currentPost.video.urls[0]).catch(() => null))?.text;
						int.update(
							client.replaceEach(util.tiktok, {
								'{user}': `@${args[0]}`,
								'{videoUrl}': currentPost.video.shortened_video || currentPost.video.urls[0],
								'{mainComment}': currentPost.text || '',
								'{likes}': currentPost.diggCount,
								'{views}': currentPost.playCount,
								'{comments}': currentPost.commentCount,
								'{current}': (currentPost.index + 1).toString(),
								'{total}': postsData.length.toString(),
								'{date}': currentPost.createTime.length === 10 ? `<t:${currentPost.createTime}>` : (currentPost.createTime as string)
							})
						);
						break;
					case 'right':
						currentPost = postsData[currentIndex + 1]?.itemInfos || postsData[0].itemInfos;
						if (!currentPost.index) currentPost.index = postsData[currentIndex + 1] ? currentIndex + 1 : 0;
						if (!currentPost.video.shortened_video)
							currentPost.video.shortened_video = (await request.get('https://is.gd/create.php?format=simple&url=' + currentPost.video.urls[0]).catch(() => null))?.text;
						int.update(
							client.replaceEach(util.tiktok, {
								'{user}': `@${args[0]}`,
								'{videoUrl}': currentPost.video.shortened_video || currentPost.video.urls[0],
								'{mainComment}': currentPost.text || '',
								'{likes}': currentPost.diggCount,
								'{views}': currentPost.playCount,
								'{comments}': currentPost.commentCount,
								'{current}': (currentPost.index + 1).toString(),
								'{total}': postsData.length.toString(),
								'{date}': currentPost.createTime.length === 10 ? `<t:${currentPost.createTime}>` : (currentPost.createTime as string)
							})
						);
						break;
					case 'dobleright':
						currentPost = postsData[currentIndex + 10]?.itemInfos || postsData[postsData.length - 1].itemInfos;
						if (!currentPost.index) currentPost.index = postsData[currentIndex + 10] ? currentIndex + 10 : postsData.length - 1;
						if (!currentPost.video.shortened_video)
							currentPost.video.shortened_video = (await request.get('https://is.gd/create.php?format=simple&url=' + currentPost.video.urls[0]).catch(() => null))?.text;
						int.update(
							client.replaceEach(util.tiktok, {
								'{user}': `@${args[0]}`,
								'{videoUrl}': currentPost.video.shortened_video || currentPost.video.urls[0],
								'{mainComment}': currentPost.text || '',
								'{likes}': currentPost.diggCount,
								'{views}': currentPost.playCount,
								'{comments}': currentPost.commentCount,
								'{current}': (currentPost.index + 1).toString(),
								'{total}': postsData.length.toString(),
								'{date}': currentPost.createTime.length === 10 ? `<t:${currentPost.createTime}>` : (currentPost.createTime as string)
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
			client.catchError(err, message.channel as TextChannel);
		}
	}
});