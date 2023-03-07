import configFile from '../../../../config.json';
import LanguageFile from '../../structures/interfaces/LanguageFile';
function convertDate(ms: number | string) {
	const date = new Date(ms),
		months = {
			0: 'January',
			1: 'February',
			2: 'March',
			3: 'April',
			4: 'May',
			5: 'June',
			6: 'July',
			7: 'August',
			8: 'September',
			9: 'October',
			10: 'November',
			11: 'December'
		},
		days = {
			0: 'Sunday',
			1: 'Monday',
			2: 'Tuesday',
			3: 'Wednesday',
			4: 'Thursday',
			5: 'Friday',
			6: 'Saturday'
		},
		year = date.getFullYear(),
		month = months[date.getMonth() as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11],
		day = date.getDate(),
		wDay = days[date.getDay() as 1 | 2 | 3 | 4 | 5 | 6],
		hour = date.getHours().toString().padStart(2, '0'),
		minute = date.getMinutes().toString().padStart(2, '0'),
		second = date.getSeconds().toString().padStart(2, '0');
	if (day > 3 && day != 31) return `${wDay} ${day}th of ${month}, ${year} - ${hour}:${minute}:${second}`;

	if (day == 1) return `${wDay} ${day}st of ${month}, ${year} - ${hour}:${minute}:${second}`;
	if (day == 2) return `${wDay} ${day}nd of ${month}, ${year} - ${hour}:${minute}:${second}`;
	if (day == 3) return `${wDay} ${day}rd of ${month}, ${year} - ${hour}:${minute}:${second}`;
	if (day == 31) return `${wDay} ${day}st of ${month}, ${year} - ${hour}:${minute}:${second}`;
}

function T_convertor(ms: number) {
	const años = Math.floor(ms / (1000 * 60 * 60 * 24 * 365));
	const meses = Math.floor((ms % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
	const dias = Math.floor((ms % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
	const horas = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	const minutos = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
	const segundos = Math.floor((ms % (1000 * 60)) / 1000);

	let final1 = '';
	if (años > 0) final1 += años > 1 ? `${años} years, ` : `${años} year, `;
	if (meses > 0) final1 += meses > 1 ? `${meses} months and ` : `${meses} month and `;
	if (dias > 0) final1 += dias > 1 ? `${dias} days` : `${dias} day`;
	if (dias < 1 && horas > 0) final1 += horas > 1 ? `${horas} hours, ` : `${horas} hour, `;
	if (dias < 1 && minutos > 0) final1 += minutos > 1 ? `${minutos} minutes and ` : `${minutos} minute and `;
	if (dias < 1 && segundos > 0) final1 += segundos > 1 ? `${segundos} seconds` : `${segundos} second`;
	return final1;
}

function Convert(date: string) {
	const valid_keys = {
		y: { nombre: 'year(s)', tiempo: 31104000000 },
		t: { nombre: 'month(es)', tiempo: 2592000000 },
		w: { nombre: 'week(s)', tiempo: 604800000 },
		d: { nombre: 'day(s)', tiempo: 86400000 },
		h: { nombre: 'hour(s)', tiempo: 3600000 },
		m: { nombre: 'minute(s)', tiempo: 60000 },
		s: { nombre: 'second(s)', tiempo: 1000 }
	};
	if (!date) return;
	type format = 'y' | 't' | 'w' | 'd' | 'h' | 'm' | 's';
	const format: format = date.slice(-1) as format,
		time = parseInt(date.slice(0, -1));

	if (!valid_keys[format]) return;
	if (isNaN(time)) return;
	if (time <= 0) return;
	return {
		nombre: `${time} ${valid_keys[format].nombre}`,
		tiempo: valid_keys[format].tiempo * time
	};
}

export const config = {
	channel_set: {
		actions: 'Channel {channel} set as the actions logs channel.',
		infractions: 'Channel {channel} set as the infractions logs channel.',
		members: 'Channel {channel} set as the members logs channel.',
		messages: 'Channel {channel} set as the messages logs channel.',
		server: 'Channel {channel} set as the server logs channel.',
		voice: 'Channel {channel} set as the voice logs channel.',
		welcome: 'Channel {channel} set as the welcome channel.',
		disabled: '👍 Logs of that type were disabled'
	},
	role_set: {
		admin: 'Role **{role}** set as the administrator role\nBe aware that for this to work you have to set a moderator role.',
		mod: 'Role **{role}** set as the moderator role.\nBe aware that for this to work you have to set an administrator role.',
		auto: 'Role **{role}** set as the auto role',
		disabled: '👍 Role disabled'
	},
	only_text: 'The channel you selected is not a text-based channel',
	antispam_enabled: 'Ok, AntiSpam system enabled!',
	antispam_disabled: 'Ok, AntiSpam system disabled.',
	prefix_set: 'Ok, `{prefix}` set as new prefix.',
	current_languages: 'Current available languages: `es`, `en`',
	lang_set: 'Ok, {idioma} set as new language.',
	admin_perm: 'You need the administrator role to execute this command.',
	mod_perm: 'You need the administrator or moderator role to execute this command.',
	required_perms: 'You need the following permissions in order to execute this command: ',
	required_args: 'You did not provide the following argument(s): ',
	maybe_not_in_cache: ' (may be the user is not cached, try @mentioning them',
	command_used: ':wrench: {user} has used the command **{command}** in {channel}',
	twitter: {
		follow: function (username, channel, id) {
			return `You will receive notificacions from ${username} (${id}) in <#${channel.id}> when the bot restars (less than 12h)`;
		},
		unfollow: function (username) {
			return `You won't receive more notifications from ${username} when the bot restars (less than 12h)`;
		},
		not_following: 'You are not following that user, use `twitter follow username #channel` to follow them'
	}
} as LanguageFile['config'];

export const kawaii = {
	cuddle: '{author} cuddles with {member} uwu',
	hug: '{author} gives a hug full of love to {member}, how cute',
	kiss: '{member} is passionately kissed by {author} :3',
	pat: '{author} pats {member}, nyaa!',
	poke: '{author} poops {member}!',
	slap: "{author} slaps {member}, they doesn't look happy :eyes:"
} as LanguageFile['kawaii'];

export const mod = {
	need_id: 'I need to know who you want to sanction',
	not_moderatable: 'The user you selected is not moderatable by me. Check their permissions, whether they have a higher role...',
	yes: 'Yes',
	no: 'No',
	i_cant: "I can't {action} this user.",
	actions: {
		banned: 'banned',
		kicked: 'kicked',
		warned: 'warned',
		muted: 'muted',
		unbanned: 'unbanned',
		unmuted: 'unmuted'
	},
	infraction_md: 'You have been {action} in {server}. Reason: {reason}',
	infraction: '**{user}** has been {action}. Reason: {reason}',
	whose_messages: '¿Whose are the messages that you want to delete?',
	bulkDelete_14d: 'You can only delete messages that are under 14 days old.',
	delete_infr: 'Ok, infraction {key} deleted.',
	embed: {
		embed_code: 'You need to include the JSON code or look at the command example by usig `command embed` (https://phodit.net/embedbuilder/)',
		create_embed: '\nYou can use `embed help` to see how the command works',
		how_it_works:
			'**How to use the EMBED command**\nThe `embed` command can work in two ways, the first, using the embed JSON code (https://phodit.net/embedbuilder/), and the second is by separating what you want in the embed with **|** \nAn example would be `embed title: embed title | description: embed description | fields: [{"name": "title of the first field", "value": "value of the first field"}, ...] `\n This is a simple example, you can add many more things to the embed (title, description, fields, footer, thumbnail, image and color). They do not have to be in order, you can order it as you want. \nThis has been the help for the EMBED command, if you need more help, you can ask the support server ( t-support)'
	},
	user_404: "I couldn't find a user with id {id}",
	user_infrs: "{user}'s infractions ```ml\nType | Moderator | Reason | Duration | Active? | Date | Infr ID \n ------------------------------------",
	infrs_404: "The given user doesn't have infractions",
	channel_lock: 'SendMessages permission has been denied for `{role}`',
	channel_unlock: 'SendMessages permission has been re-established for `{role}`',
	temp_infr_md: 'You have been {action} in {server}. Reason: {reason} | Duration: {time}',
	temp_infr: '{user} has been {action}. Reason: {reason} | Time {time}',
	time_404: 'You need to type the time.',
	has_role: '{member} already has the role {role}.',
	role_added: '{member} received the role {role}.',
	role_404: "The role you selected does not exist or its position is higher than mine's",
	has_role_nt: "{member} doesn't have the role {role}",
	role_removed: '{role} has been removed from {member}',
	need_reason: 'You need to type the reason of the infraction',
	which_edit: 'What do you want to edit?',
	antispam: 'you have been muted for spamming',
	infraction_created: '**{infr}**\nUser: `{user}`\nModerator: `{mod}`\nID: `{id}`\nTime: `{time}`\nReason: `{reason}`',
	modinf: 'Infraction {infr} modified.',
	mkick: '{count} users were kicked',
	mban: '{count} users were banned',
	no_muted_role: 'A role named "Trimuted" does not exist, use the command `mute` at least once to create it',
	timeout: {
		clear: "{member}'s time-out was cleared",
		timeout: '{member} was timed out for {duration}. Reason: {reason}',
		already_timed_out: 'That member is already timed out. If you want to clear the timeout, use the same command and set the duration to 0.',
		time: 'The duration should not be higher than 28 days'
	}
} as LanguageFile['mod'];

export const welcome = {
	wcolor: 'Ok, {color} set as welcome text color.',
	wimage: 'Ok, image set as welcome image.',
	wmessage: 'Ok, text set as welcome text.',
	channel: 'Ok, channel {channel} set as welcome channel.',
	hex: 'It must be a hexadecimal (including #)',
	need_url: 'You need to add the url of the image'
} as LanguageFile['welcome'];

export const functions = {
	Convert: Convert,
	convertDate: convertDate,
	T_convertor: T_convertor
} as LanguageFile['functions'];

export const music = {
	loop: {
		enabled: '🔁 Loop enabled',
		disabled: '🔁 Loop disabled'
	},
	shuffle: {
		enabled: '🔀 Shuffle enabled',
		disabled: '🔀 Shuffle disabled'
	},
	autoplay: {
		enabled: '⏭️ Autoplay enabled',
		disabled: '⏭️ Autoplay disabled'
	},
	pause: '⏸ Playback paused',
	resume: '▶ Playback resumed',
	tts: {
		file: 'No puedes usar este comando mientras haya un archivo sonando',
		too_long: 'The text shall be 200 or fewer in length'
	},
	playlists: {
		titles: {
			recent: 'Recent playlists',
			top: 'Best playlists',
			by: 'Playlists made by',
			default: 'Your playlists'
		},
		play: 'Type the number of the playlist you want to see or `play <number>` to listen to that playlist',
		play_from_other: 'Type `play <number>` to listen to a playlist',
		song_add_or_remove: 'Type `remove <number>` to remove a song, and `add` if you want to add',
		which_song: 'Escribe el nombre de la canción que quieras añadir',
		added_to_playlist: `Song \`{song}\` added to the playlist`,
		removed_from_playlist: `Song \`{song}\` removed from the playlists`,
		same_name: 'A playlist with that name already exists',
		playlist_created: `Playlist \`{name}\` succesfully created, add some songs selecting it by \`{prefix}playlist list\``,
		type_to_remove: 'Type the number of the playlist you want to delete',
		playlist_deleted: `Playlist \`{pl}\` deleted`,
		playlist_songs: 'Playlist songs',
		no_playlists: 'The given uses does not have playlists',
		added_to_queue: 'The playlist is being added to the queue'
	},
	ytt: {
		yttogether: 'Click here to start **YouTube Together** in ',
		yt_invited: 'You have been invited by **{author}** to a session of **YouTube Together**: ',
		yt_nodm: 'I could not send a direct message to the user',
		yt_dm: 'The user was notified in DM'
	},
	no_vc: 'You are not in a voice channel',
	wrong_vc: 'You are not in my voice channel',
	no_queue: "There isn't any song in the queue",
	leave_timeout: 'I left the channel because there was nobody listening to me :(',
	lyrics_name: 'You need to type the name of the song',
	lyrics_not_found: 'I could not find the lyrics of the song you requested. Try being more specific (the artist...)',
	not_found: 'Nothing could be found',
	error_nothing_found: 'There was an error while searching for that video: ',
	that_video: 'that video',
	error_stream: "There was an error when attempting to play {video}, **it is highly possible that it is age restricted (therefore I can't play it)**. More info below\n\n",
	length: 'Lyrics are too long',
	now_playing: '__Now playing__',
	requested_by: 'Requested by:',
	playlist: 'Playlist: **{playlist}** has been added to the queue',
	queue_songs: '__**Queued Songs**__',
	queue_page: 'Page {number} of {total} | Estimated duration of {min} minutes',
	need_qnumber: 'Type a number to delete it from the queue',
	must_be_number: 'You must type a number',
	cannot_move: 'You cannot move the currently playing song',
	cannot_remove: 'You cannot delete that song',
	song_moved: '**{song}** has been moved successfully',
	song_removed: '**{song}** has been removed from the queue',
	song_removed_and_sliced: 'The songs from that song to the end where removed from the queue',
	song_404: "There isn't a song with that number in the queue",
	invalid_song: 'Invalid song, cancelling.',
	song_select: '__**Song Selection**__',
	cancel_select: 'Type "cancel" if you do not want to select any song.',
	type_a_number: 'Type a number to select the song',
	cancel: 'No response. Cancelling...',
	seek: 'Jumping to {time}...',
	seek_cancelled: 'The video ends before arriving there',
	cannot_seek_files: 'This command is not available for files',
	skip: {
		already_voted: 'You already voted to skip ({votes})',
		skipping: 'Skipping...',
		voting: '¿Skipping? {votes}'
	},
	volume: 'I set the volume to {volume}',
	too_much: 'The maximum volume is 5',
	skipto_restricted: 'You can only use this command if you are less than 4 persons in the call or you have a role called **DJ**',
	play: {
		added_to_queue: {
			title: '__Added to the queue__',
			description: '{song} has been succesfully added to the queue',
			channel: 'Channel:',
			duration: 'Duration:'
		},
		now_playing: {
			title: '__Now playing__',
			channel: 'Channel:',
			duration: 'Duration:',
			requested_by: 'Requested by:',
			tts: 'Playing text in the voice channel'
		}
	},
	need_dj: {
		remove: 'You need a role named DJ to remove a song of another member',
		move: 'You need a role named DJ to move a song of another member',
		stop: 'You need a role named DJ to stop a song of another member.',
		volume: 'You need a role named DJ to change the volume'
	}
} as LanguageFile['music'];

export const util = {
	user: {
		information: '**__Information__**',
		server: '**__Server Specific__**',
		main_info: function (user) {
			// eslint-disable-next-line prettier/prettier
			return `**ID**: ${user.id}\n**Created**: <t:${Math.floor(user.createdTimestamp / 1000)}:R> **->** <t:${Math.floor(user.createdTimestamp / 1000)}:F>\n**Bot**: ${user.bot ? 'Yes' : 'No'}`;
		},
		server_specific: function (member) {
			return `**Display name**: ${member.displayName}\n**Joined**: <t:${Math.floor(member.joinedTimestamp! / 1000)}:R> **->** <t:${Math.floor(
				member.joinedTimestamp! / 1000
			)}:F>\n**Roles**: ${member.roles.cache
				.sort((b, a) => a.position - b.position)
				.map((r) => `${r}`)
				.join(' ')}`.slice(0, 1000);
		},
		createdString: '🌐 Created at:',
		created: function (user) {
			return `${convertDate(user.createdTimestamp)}. ${T_convertor(Math.floor(Date.now()) - user.createdTimestamp)} ago.`;
		},
		nickname: '📛 Nickname',
		status: {
			dnd: '<:dnd:663871630488895501> Do not disturb',
			idle: '<:idle:663871377539072011> Idle',
			online: '<:online:663872345009684481> Online',
			offline: '<:offline:663871423189876776> Offline'
		},
		joinedString: '📥 Joined at:',
		joined: function (user) {
			return `${convertDate(user.joinedTimestamp!)}. ${T_convertor(Math.floor(Date.now()) - user.joinedTimestamp!)} ago.`;
		},
		server_avatar: 'View server avatar',
		user_avatar: 'View user avatar'
	},
	server: {
		main: function (guild, owner) {
			return `**ID**: ${guild.id}\n**Owner**: <@${owner.id}> (${owner.user.tag})\n**Created**: <t:${Math.floor(guild.createdTimestamp / 1000)}:R> -> <t:${Math.floor(
				guild.createdTimestamp / 1000
			)}:F>\n**Members**: ${guild!.memberCount}`;
		},
		owner: '__Owner__',
		createdString: '__Created__',
		members: '__Members__',
		region: '__Region__',
		created: function (guild) {
			return `<t:${guild.createdTimestamp}:R> -> <t:${guild.createdTimestamp}:F>`;
		}
	},
	manga: {
		type: 'Type',
		volumes: 'Volumes',
		chapters: 'Chapters',
		author: 'Author',
		published: 'Published',
		genre: 'Genre',
		status: 'Status',
		ranking: 'Ranking',
		popularity: 'Popularity'
	},
	cooldown: function (time, command) {
		return `you need to wait ${time} seconds before reusing the command \`${command}\``;
	},
	image: {
		title: 'Search Results',
		footer: 'Page '
	},
	sauce: {
		no_image: 'I could not find any image in that message',
		title: 'Sauce!',
		more_source: 'Other sources:',
		looks_like: function (result) {
			return `I found results with ${result.header.similarity}% of similarity: [${decodeURI(result.data.title || result.data.source || result.data.ext_urls[0])}](${
				result.data.ext_urls ? result.data.ext_urls[0] : 'https://discord.com'
			}).`;
		},
		search_sources: function (url) {
			return `<:google:749389813274378241> [Search image in Google](https://www.google.com/searchbyimage?image_url=${url})\n<:yandex:749389643367186573> [Search image in Yandex (recommended)](https://yandex.com/images/search?url=${url}&rpt=imageview)\n<:saucenao:785119535454748682> [Search image in SauceNAO (NSFW)](https://saucenao.com/search.php?url=${url})`;
		}
	},
	remind: function (reason, time) {
		return `Ok, I will remind you \`${reason}\` in ${Convert(time)?.nombre || time}`;
	},
	timezone: 'The current time in {country} is {time}',
	today: {
		title: 'On this day',
		see_more: '❯ See More'
	},
	translate: {
		title: 'Translation',
		from: 'From',
		to: 'To',
		not_found: 'Language not found, use `translate list` to check the languages list',
		text_not_found: 'I could not find text in that message'
	},
	map: {
		too_much_zoom: 'You reached the maximum allowed zoom',
		too_little_zoom: 'You reached the minimum allowed zoom',
		street: 'Street name',
		zipcode: 'Zip code',
		city: 'City',
		state: 'State',
		country: 'Country',
		found: function (results, current) {
			return `Found ${results.length} results. Currently showing the ${current}`;
		}
	},
	feedback: {
		title: 'Do you want your comment to have a title?',
		comment: 'What do you want to tell to the developer?',
		main: 'Your comments are very important to help the developer to improve the bot. If you want to send feedback, press the button.',
		send_feedback: 'Send feedback',
		thank_you: 'Thank you for your feedback.'
	},
	loading: '<a:loading:735243076758667275> Processing...',
	nsfw: "This channel isn't NSFW, use the command in one NSFW channel",
	invite: {
		title: 'Invite me to your server!',
		description: `A useful and interactive bot which strives to make your server a better place.\n> [Recommended invitation]({invite_link})\n> [Invitation without perms]({invite_link_np})\n If you need help, don't hesitate to join the [support server](${configFile.support_server_invite}) and ask there.`
	},
	horse_race: {
		title: 'Horse race',
		description: 'A horse race is beggining in 15 seconds. Let each participant choose the horse they want to bet on.',
		list: 'Available horses:',
		started: 'The horse race is about to begin',
		selected: 'Your choice was confirmed.',
		no_bets: "Sorry, can't have a race with no bets!",
		win: 'And the winners are... **{users}**!',
		img: 'https://cdn.discordapp.com/attachments/487962590887149603/714123824743972924/enleaderboard.png'
	},
	help: {
		title: 'Commands',
		description: 'If you need help with any command use {prefix} command <command>',
		fields: {
			info: '❯ Information',
			util: '❯ Utilities',
			image_manipulation: '❯ Image manipulation',
			social: '❯ Social',
			music: '❯ Music',
			fun: '❯ Fun',
			mod: '❯ Moderation',
			config: '❯ Configuration'
		},
		footer: ' commands.'
	},
	invalid_user: 'You did not provide a valid user',
	similar_commands: '**Hmmph, it seems that you have tried to use a command**.\nPress the button with the name of the desired command or X if it is none of them.',
	command_selected: 'Command executed 👍',
	none_selected: 'Understood, closing interaction',
	about: `A Discord bot with a lot of commands and now open source!\n\n**{username}** strives to make your server a better place by having a lot of useful and interactive commands for almost anything you need.\nYou can find its source code here: https://github.com/k2helix/trihammer\n\n> [Recommended invite]({invite_link})\n> [Invite without perms]({invite_link_np})\n\nIf you need help, don't hesitate to join the [support server](${configFile.support_server_invite}) and ask there.\nCurrently serving on **{guilds} servers** and **{members} cached members**.`,
	game: {
		release: 'Release Date:',
		genres: 'Genres:',
		price: 'Price:',
		publishers: 'Publishers',
		not_found: "I couldn't find that game on Steam",
		show_dlcs: 'Show DLCs'
	},
	convert: {
		need: 'It should be {prefix}convert <amount> <base unit> <target unit> (separated by espaces)',
		success: '{amount} {base} are {number} {target}'
	},
	tiktok: "__**{user}'s posts**__\n{videoUrl}\n{mainComment}\n**♥️ Likes**: {likes}\n**👁️ Views**: {views}\n**👁‍🗨 Comments**: {comments}\nPost {current} of {total}\n{date}",
	connect4: {
		bot: 'bots may not be played against.',
		challenge: ', do you accept the challenge? (yes or no)',
		unverified: 'Looks like they declined...',
		waiting: 'Waiting for an answer...',
		success: 'Answer received! Good luck!',
		column: ', which column do you pick? Type `end` to forefeit.',
		tictactoe: 'Type the row followed by the column you choose, for example 1 3.',
		timeout: 'Sorry, time is up!',
		inactivity: 'Game ended due to inactivity',
		win: 'Congrats, ',
		draw: "Looks like it's a draw"
	},
	command: {
		not_found: "I couldn't find a command with that name or alias",
		title: 'Command',
		fields: {
			usage: 'Usage',
			required_perms: 'Required permissions',
			required_roles: 'Required roles',
			alias: 'Alias'
		},
		footer: 'The things inside <> are required, while inside [] are optional.'
	},
	anime: {
		nothing_selected: 'Nothing selected',
		you_cant: 'You cannot select if you did not use the command.',
		episodes: 'Episodes',
		status: 'Status',
		aired: 'Aired',
		genre: 'Genre',
		studio: 'Studio',
		source: 'Source',
		duration: 'Duration of episodes',
		ranking: 'Ranking',
		popularity: 'Popularity',
		footer: 'Taken from MyAnimeList',
		type_a_number: 'Pon un número para seleccionar',
		screenshot: {
			no_image: 'You need to send an image or the URL of the image',
			similarity: 'Similarity:',
			at: 'At:',
			more_results: 'More results:'
		}
	}
} as LanguageFile['util'];

export const xp = {
	lvlroles: {
		show: 'EXP Roles',
		remove: 'Incorrect usage, leveledroles [remove] <role id> <level>',
		add: 'Incorrect usage, leveledroles <role id> <level>',
		no_roles: "The server doesn't have EXP roles",
		removed: 'Role removed from the leveled roles list successfully',
		added: 'Role added to the leveled roles list successfully'
	},
	rep: {
		cooldown: function (time, prefix) {
			return `You need to wait ${T_convertor(
				time
			)} to gave reputation. (Or you can vote for me in top.gg and use \`${prefix}rep reset @user\` to give another reputation point! https://top.gg/bot/611710846426415107/vote)`;
		},
		added: '**{author}** gave one reputation point to **{user}**',
		user: 'You need to mention someone to give rem',
		reset: 'Your cooldown has been reset, thanks for voting <3',
		no_reset: "Looks like you haven't voted for me (https://top.gg/bot/611710846426415107/vote)"
	},
	lvlup: 'Congratulations, {user}, you received the role {role}! :tada:',
	no_perms: 'You do not have permission to use this command',
	need_lvl: 'The level must be a number',
	level_set: "Set **{user}**'s level to **{level}**"
} as LanguageFile['xp'];

export const other = {
	need_perm: {
		channel: 'I need the following permission in the channel to execute that command: {perms}',
		guild: 'I need the following permission in the server to execute that command: {perms}',
		attach_files: 'You need permission to attach files to use this command'
	},
	error: 'An error ocurred while executing that command: ',
	mention: 'My prefix is `{prefix}`, if you need help use `{prefix}help`'
} as LanguageFile['other'];

export const events = {
	voice: {
		joined: ':blue_circle: {user} has joined voice channel {channel}',
		left: ':red_circle: {user} has left voice channel {channel}',
		moved: ':orange_circle: {user} has left voice channel {oldChannel} and has joined voice channel {newChannel}'
	},
	user: {
		name: 'User {oldUser} has changed their username, before change was `{oldUser}` and after change `{newUser}` .'
	},
	role: {
		update: {
			added: 'The permissions for {role} were updated, added: `{perms}`',
			removed: 'The permissions for {role} were updated, removed: `{perms}`',
			both: 'The permissions for {role} were updated, added: `{added}` . Removed: `{removed}`',
			none: 'A role has been updated: `{role}`'
		},
		delete: 'Role deleted: `{role}`',
		create: 'Role created: `{role}`'
	},
	message: {
		update: 'Message from {user} edited in {channel}',
		from: 'From:',
		to: 'To:',
		delete: 'A message from {author} was deleted in {channel}:\n```{content}```',
		deleteBulk: {
			deleted: '{messages} messages were deleted',
			showing: 'Showing {amount} of {total} characters.'
		}
	},
	member: {
		update: {
			role_added: 'A role was added to {member}: {role}',
			role_removed: 'A role was removed to {member}: {role}',
			nickname: 'The nickname of {member} changed from `{old}` to `{new}`'
		},
		remove: function (member) {
			return `:red_circle: ${member.user.tag} has left the server, joined at <t:${Math.floor(member.joinedTimestamp! / 1000)}>`;
		},
		add: function (user) {
			return `:blue_circle: ${user.tag} has joined the server, created <t:${Math.floor(user.createdTimestamp / 1000)}:R>`;
		}
	},
	channel: {
		update: {
			added: 'The permissions for {role} in {channel} have changed, added: `{added}`',
			removed: 'The permissions for {role} in {channel} have changed, removed: `{perms}`',
			both: 'The permissions for {role} in {channel} have changed, added: `{added}`. Removed: `{removed}`'
		},
		delete: 'A channel has been deleted: `{name}`',
		create: 'A channel has been created: `{name}`'
	}
} as LanguageFile['events'];
