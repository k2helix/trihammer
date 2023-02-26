// @ts-nocheck
import MessageCommand from '../../lib/structures/Command';
import request from 'node-superfetch';
import { load } from 'cheerio';
import LanguageFile from '../../lib/structures/interfaces/LanguageFile';
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ChatInputCommandInteraction, ComponentType, TextChannel } from 'discord.js';
import { abbrNum, shuffle } from '../../lib/utils/functions';
import ExtendedClient from '../../lib/structures/Client';

interface post {
	itemInfos: {
		video: {
			urls: string[];
			shortened_video: string | null | undefined;
		};
		text: string | null;
		createTime: string;
		playCount: string | number;
		diggCount: string | number;
		commentCount: string | number;
		index: number;
	};
}

function postMessage(client: ExtendedClient, post: post['itemInfos'], baseString: string) {
	return client.replaceEach(baseString, {
		'{videoUrl}': post.video.shortened_video || post.video.urls[0],
		'{mainComment}': post.text || '',
		'{likes}': !isNaN(post.diggCount as number) ? abbrNum(post.diggCount as number, 1) : (post.diggCount as string),
		'{views}': !isNaN(post.playCount as number) ? abbrNum(post.playCount as number, 1) : (post.playCount as string),
		'{comments}': !isNaN(post.commentCount as number) ? abbrNum(post.commentCount as number, 1) : (post.commentCount as string),
		'{current}': (post.index + 1).toString(),
		'{date}': post.createTime.length === 10 ? `<t:${post.createTime}>` : (post.createTime as string)
	});
}

async function shortenUrl(url: string) {
	return (await request.get('https://is.gd/create.php?format=simple&url=' + url).catch(() => null))?.text;
}

export default new MessageCommand({
	name: 'tiktok',
	description: 'Search for someone in TikTok',
	category: 'utility',
	cooldown: 5,
	async execute(client, interaction, guildConf) {
		let currentPost: post['itemInfos'];
		let postsData: post[];
		interaction.reply({ embeds: [client.loadingEmbed()] });
		try {
			// randomize because sometimes some instances do work but the video link does not (mainly the first one)
			let instances = shuffle([
				// 'https://proxitok.pabloferreiro.es',
				'https://proxitok.pussthecat.org',
				// 'https://proxitok.privacydev.net',
				'https://proxitok.esmailelbob.xyz',
				'https://tok.artemislena.eu',
				'https://tok.adminforge.de'
			]);
			let currentInstance = 0;
			do {
				let r = await request.get(`${instances[currentInstance]}/@${(interaction as ChatInputCommandInteraction).options.getString('user')}`).catch(() => null);
				if (r?.status === 200) {
					let $ = load(r.text as string);
					let posts = $('div[class="media-content"]');
					let videoSources = posts.find('source');
					postsData = [];
					for (let index = 0; index < posts.length; index++) {
						const content = posts[index];
						let valuableChildren = content.children.filter((ch) => ch.children && !ch.attribs.class);

						let nameAndDateParagraph = valuableChildren[0];
						// let tagsParagraph = valuableChildren.find((ch) => ch.children[0].attribs && ch.children[0].attribs.class === 'tags');
						let mainCommentParagraph = valuableChildren.find((ch) => ch.children.length === 1);
						let interactionsParagraph = valuableChildren[valuableChildren.length - 1];

						let date = nameAndDateParagraph.children.find((ch: { name: string; attribs: { title: string } }) => ch.name === 'small' && ch.attribs?.title).children[0]?.data;
						let mainComment = mainCommentParagraph ? mainCommentParagraph.children[0].data : null;
						let interactions = interactionsParagraph.children.filter((ch: { attribs: { class: string } }) => ch.attribs && ch.attribs.class === 'icon-text');
						let views = interactions[0].children.filter((ch: { name: string }) => ch.name === 'span')[1].children[0].data;
						let likes = interactions[1].children.filter((ch: { name: string }) => ch.name === 'span')[1].children[0].data;
						let comments = interactions[2].children.filter((ch: { name: string }) => ch.name === 'span')[1].children[0].data;

						let videoSrc = videoSources[index].attribs.src;
						postsData.push({
							itemInfos: {
								video: { urls: [videoSrc.slice(videoSrc.lastIndexOf('https'))], shortened_video: null },
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
				// broken as of 15/9/22, just scrape from proxitok
				let { text } = await request.get({
					url: `https://www.tiktok.com/node/share/user/@${(interaction as ChatInputCommandInteraction).options.getString('user')}?aid=1988`,
					headers: {
						'User-Agent': 'Mozilla/5.0 (Linux; U; Android 4.1.1; en-gb; Build/KLP) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30'
					}
				});
				let parsedResponse = JSON.parse(text!);
				if (parsedResponse.statusCode !== 0)
					return interaction.editReply({
						embeds: [client.redEmbed(`[${parsedResponse.statusCode}] An error ocurred while getting the user id (does the user exist?).\n${parsedResponse.statusMsg}`)]
					});
				let userData = parsedResponse.userInfo;
				let postsRequest = await request.get({
					url: 'https://m.tiktok.com/share/item/list?type=1&cursor=0&minCursor=0&maxCursor=0',
					query: {
						id: userData.user.id,
						count: (50 * 6).toString(),
						_signature: '_02B4Z6wo00f01dm7eCQAAIBDJ6yC3DDIHBXZq3SAABS723'
					},
					headers: {
						'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4256.184 Safari/537.36',
						referer: 'https://www.tiktok.com/'
					}
				});

				let parsedData = JSON.parse(postsRequest.text!);
				if (parsedData.statusCode !== 0)
					return interaction.editReply({ embeds: [client.redEmbed(`[${parsedData.statusCode}] An error ocurred while getting user posts.\n${parsedData.errMsg}`)] });
				postsData = parsedData.body.itemListData;

				currentPost = postsData[0]?.itemInfos;
				if (currentPost) currentPost.index = 0;
			}

			const { util, music } = (await import(`../../lib/utils/lang/${guildConf.lang}`)) as LanguageFile;

			if (!currentPost) return interaction.editReply({ embeds: [client.redEmbed(music.not_found)] });
			currentPost.video.shortened_video = await shortenUrl(
				'https://is.gd/create.php?format=simple&url=' + `${instances[currentInstance - 1]}/stream?url=` + encodeURIComponent(currentPost.video.urls[0])
			);

			const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
				new ButtonBuilder().setCustomId('dobleleft').setEmoji({ id: '882631909442744350' }).setStyle(ButtonStyle.Primary),
				new ButtonBuilder().setCustomId('left').setEmoji({ id: '882626242459861042' }).setStyle(ButtonStyle.Primary),
				new ButtonBuilder().setCustomId('right').setEmoji({ id: '882626290253959258' }).setStyle(ButtonStyle.Primary),
				new ButtonBuilder().setCustomId('dobleright').setEmoji({ id: '882631788550324295' }).setStyle(ButtonStyle.Primary),
				new ButtonBuilder().setCustomId('crossx').setEmoji({ id: '882639143874723932' }).setStyle(ButtonStyle.Danger)
			]);

			let baseString = client.replaceEach(util.tiktok, {
				'{user}': `@${(interaction as ChatInputCommandInteraction).options.getString('user')}`,
				'{total}': postsData.length.toString()
			});

			interaction.editReply({
				content: postMessage(client, currentPost, baseString),
				components: [row],
				embeds: []
			});

			let msg = await interaction.fetchReply();
			const filter = (int: ButtonInteraction) => int.user.id === interaction.user.id;
			const collector = msg.createMessageComponentCollector({ filter, time: 300000, componentType: ComponentType.Button });
			collector.on('collect', async (int) => {
				let currentIndex = currentPost.index;
				switch (int.customId) {
					case 'dobleleft':
						currentPost = postsData[currentIndex - 10]?.itemInfos || postsData[0].itemInfos;
						if (!currentPost.index) currentPost.index = postsData[currentIndex - 10] ? currentIndex - 10 : 0;
						if (!currentPost.video.shortened_video)
							currentPost.video.shortened_video = await shortenUrl(
								'https://is.gd/create.php?format=simple&url=' + `${instances[currentInstance - 1]}/stream?url=` + encodeURIComponent(currentPost.video.urls[0])
							);
						int.update(postMessage(client, currentPost, baseString));
						break;
					case 'left':
						currentPost = postsData[currentIndex - 1]?.itemInfos || postsData[postsData.length - 1].itemInfos;
						if (!currentPost.index) currentPost.index = postsData[currentIndex - 1] ? currentIndex - 1 : postsData.length - 1;
						if (!currentPost.video.shortened_video)
							currentPost.video.shortened_video = await shortenUrl(
								'https://is.gd/create.php?format=simple&url=' + `${instances[currentInstance - 1]}/stream?url=` + encodeURIComponent(currentPost.video.urls[0])
							);
						int.update(postMessage(client, currentPost, baseString));
						break;
					case 'right':
						currentPost = postsData[currentIndex + 1]?.itemInfos || postsData[0].itemInfos;
						if (!currentPost.index) currentPost.index = postsData[currentIndex + 1] ? currentIndex + 1 : 0;
						if (!currentPost.video.shortened_video)
							currentPost.video.shortened_video = await shortenUrl(
								'https://is.gd/create.php?format=simple&url=' + `${instances[currentInstance - 1]}/stream?url=` + encodeURIComponent(currentPost.video.urls[0])
							);
						int.update(postMessage(client, currentPost, baseString));
						break;
					case 'dobleright':
						currentPost = postsData[currentIndex + 10]?.itemInfos || postsData[postsData.length - 1].itemInfos;
						if (!currentPost.index) currentPost.index = postsData[currentIndex + 10] ? currentIndex + 10 : postsData.length - 1;
						if (!currentPost.video.shortened_video)
							currentPost.video.shortened_video = await shortenUrl(
								'https://is.gd/create.php?format=simple&url=' + `${instances[currentInstance - 1]}/stream?url=` + encodeURIComponent(currentPost.video.urls[0])
							);
						int.update(postMessage(client, currentPost, baseString));
						break;
					case 'crossx':
						int.update({ components: [] });
						break;
				}
			});

			collector.on('end', () => {
				msg.edit({ components: [] }).catch(() => null);
			});
		} catch (err) {
			client.catchError(err, interaction.channel as TextChannel);
		}
	}
});
