import { Guild, GuildMember, TextChannel, User } from 'discord.js';
import { Result } from './SaucenaoInterfaces';

export default interface LanguageFile {
	config: {
		channel_set: {
			actions: string;
			infractions: string;
			members: string;
			messages: string;
			server: string;
			voice: string;
			welcome: string;
			disabled: string;
		};
		role_set: {
			admin: string;
			mod: string;
			auto: string;
			disabled: string;
		};
		only_text: string;
		antispam_enabled: string;
		antispam_disabled: string;
		prefix_set: string;
		current_languages: string;
		lang_set: string;
		admin_perm: string;
		mod_perm: string;
		required_perms: string;
		required_args: string;
		maybe_not_in_cache: string;
		command_used: string;
		twitter: {
			follow: (username: string, channel: TextChannel, id: string) => string;
			unfollow: (username: string) => string;
			not_following: string;
		};
	};
	kawaii: {
		cuddle: string;
		hug: string;
		kiss: string;
		pat: string;
		poke: string;
		slap: string;
	};
	mod: {
		need_id: string;
		not_moderatable: string;
		yes: string;
		no: string;
		i_cant: string;
		actions: {
			banned: string;
			kicked: string;
			warned: string;
			muted: string;
			unbanned: string;
			unmuted: string;
		};
		infraction_md: string;
		infraction: string;
		whose_messages: string;
		bulkDelete_14d: string;
		delete_infr: string;
		embed: {
			embed_code: string;
			create_embed: string;
			how_it_works: string;
		};
		user_404: string;
		user_infrs: string;
		infrs_404: string;
		channel_lock: string;
		channel_unlock: string;
		temp_infr_md: string;
		temp_infr: string;
		time_404: string;
		has_role: string;
		role_added: string;
		role_404: string;
		has_role_nt: string;
		role_removed: string;
		need_reason: string;
		which_edit: string;
		antispam: string;
		infraction_created: string;
		modinf: string;
		mkick: string;
		mban: string;
		no_muted_role: string;
		timeout: {
			clear: string;
			timeout: string;
			already_timed_out: string;
			time: string;
		};
	};
	welcome: {
		wcolor: string;
		wimage: string;
		wmessage: string;
		channel: string;
		hex: string;
		need_url: string;
	};
	functions: {
		Convert: (date: string) => { nombre: string; tiempo: number };
		convertDate: (ms: number) => string;
		T_convertor: (ms: number) => string;
	};
	music: {
		loop: {
			enabled: string;
			disabled: string;
		};
		shuffle: {
			enabled: string;
			disabled: string;
		};
		autoplay: {
			enabled: string;
			disabled: string;
		};
		pause: string;
		resume: string;
		tts: {
			queue: string;
			too_long: string;
		};
		playlists: {
			titles: {
				recent: string;
				top: string;
				by: string;
				default: string;
			};
			play: string;
			play_from_other: string;
			song_add_or_remove: string;
			which_song: string;
			added_to_playlist: string;
			removed_from_playlist: string;
			same_name: string;
			playlist_created: string;
			type_to_remove: string;
			playlist_deleted: string;
			playlist_songs: string;
			no_playlists: string;
			added_to_queue: string;
		};
		ytt: {
			yttogether: string;
			yt_invited: string;
			yt_nodm: string;
			yt_dm: string;
		};
		no_vc: string;
		wrong_vc: string;
		no_queue: string;
		leave_timeout: string;
		lyrics_name: string;
		lyrics_not_found: string;
		not_found: string;
		error_nothing_found: string;
		that_video: string;
		error_stream: string;
		length: string;
		now_playing: string;
		requested_by: string;
		playlist: string;
		queue_songs: string;
		queue_page: string;
		need_qnumber: string;
		must_be_number: string;
		cannot_move: string;
		cannot_remove: string;
		song_moved: string;
		song_removed: string;
		song_removed_and_sliced: string;
		song_404: string;
		invalid_song: string;
		song_select: string;
		cancel_select: string;
		type_a_number: string;
		cancel: string;
		seek: string;
		seek_cancelled: string;
		skip: {
			already_voted: string;
			skipping: string;
			voting: string;
		};
		volume: string;
		too_much: string;
		skipto_restricted: string;
		play: {
			added_to_queue: {
				title: string;
				description: string;
				channel: string;
				duration: string;
			};
			now_playing: {
				title: string;
				channel: string;
				duration: string;
				requested_by: string;
				tts: string;
			};
		};
		need_dj: {
			remove: string;
			move: string;
			stop: string;
			volume: string;
		};
	};
	util: {
		user: {
			information: string;
			server: string;
			main_info: (user: User) => string;
			server_specific: (member: GuildMember) => string;
			createdString: string;
			created: (user: User) => string;
			nickname: string;
			status: {
				dnd: string;
				idle: string;
				online: string;
				offline: string;
			};
			joinedString: string;
			joined: (user: GuildMember) => string;
		};
		server: {
			main: (guild: Guild, owner: GuildMember) => string;
			owner: string;
			createdString: string;
			members: string;
			region: string;
			created: (guild: Guild) => string;
		};
		manga: {
			type: string;
			volumes: string;
			chapters: string;
			author: string;
			published: string;
			genre: string;
			status: string;
			ranking: string;
			popularity: string;
		};
		cooldown: (time: string | number, command: string) => string;
		image: {
			title: string;
			footer: string;
		};
		sauce: {
			no_image: string;
			title: string;
			more_source: string;
			looks_like: (result: Result) => string;
			search_sources: (url: string) => string;
		};
		remind: (reason: string, time: string) => string;
		timezone: string;
		today: {
			title: string;
			see_more: string;
		};
		translate: {
			title: string;
			from: string;
			to: string;
			not_found: string;
			text_not_found: string;
		};
		map: {
			too_much_zoom: string;
			too_little_zoom: string;
			street: string;
			zipcode: string;
			city: string;
			country: string;
			state: string;
			found: <T>(results: T[], current: T) => string;
		};
		loading: string;
		nsfw: string;
		invite: {
			title: string;
			description: string;
		};
		horse_race: {
			title: string;
			description: string;
			selected: string;
			started: string;
			list: string;
			no_bets: string;
			win: string;
			img: string;
		};
		help: {
			title: string;
			description: string;
			fields: {
				info: string;
				util: string;
				image_manipulation: string;
				social: string;
				music: string;
				fun: string;
				mod: string;
				config: string;
			};
			footer: string;
		};
		invalid_user: string;
		similar_commands: string;
		command_selected: string;
		none_selected: string;
		about: string;
		game: {
			release: string;
			genres: string;
			price: string;
			publishers: string;
			not_found: string;
		};
		convert: {
			need: string;
			success: string;
		};
		tiktok: string;
		connect4: {
			bot: string;
			challenge: string;
			unverified: string;
			waiting: string;
			success: string;
			column: string;
			tictactoe: string;
			timeout: string;
			inactivity: string;
			win: string;
			draw: string;
		};
		command: {
			not_found: string;
			title: string;
			fields: {
				usage: string;
				required_perms: string;
				required_roles: string;
				alias: string;
			};
			footer: string;
		};
		anime: {
			nothing_selected: string;
			you_cant: string;
			episodes: string;
			status: string;
			aired: string;
			genre: string;
			studio: string;
			source: string;
			duration: string;
			ranking: string;
			popularity: string;
			footer: string;
			type_a_number: string;
			screenshot: {
				no_image: string;
				similarity: string;
				at: string;
				more_results: string;
			};
		};
	};
	xp: {
		lvlroles: {
			show: string;
			remove: string;
			add: string;
			no_roles: string;
			removed: string;
			added: string;
		};
		rep: {
			cooldown: (time: number, prefix: string) => string;
			added: string;
			user: string;
			reset: string;
			no_reset: string;
		};
		lvlup: string;
		no_perms: string;
		need_lvl: string;
		level_set: string;
	};
	other: {
		need_perm: {
			channel: string;
			guild: string;
			attach_files: string;
		};
		error: string;
		mention: string;
	};
	events: {
		voice: {
			joined: string;
			left: string;
			moved: string;
		};
		user: {
			name: string;
		};
		role: {
			update: {
				added: string;
				removed: string;
				both: string;
				none: string;
			};
			delete: string;
			create: string;
		};
		message: {
			update: string;
			from: string;
			to: string;
			delete: string;
			deleteBulk: {
				deleted: string;
				showing: string;
			};
		};
		member: {
			update: {
				role_added: string;
				role_removed: string;
				nickname: string;
			};
			remove: (member: GuildMember) => string;
			add: (user: User) => string;
		};
		channel: {
			update: {
				added: string;
				removed: string;
				both: string;
			};
			delete: string;
			create: string;
		};
	};
}
