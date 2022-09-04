import configFile from '../../../../config.json';
import LanguageFile from '../../structures/interfaces/LanguageFile';
function convertDate(ms: number | string) {
	const date = new Date(ms),
		months = {
			0: 'Enero',
			1: 'Febrero',
			2: 'Marzo',
			3: 'Abril',
			4: 'Mayo',
			5: 'Junio',
			6: 'Julio',
			7: 'Agosto',
			8: 'Septiembre',
			9: 'Octubre',
			10: 'Noviembre',
			11: 'Diciembre'
		},
		days = {
			0: 'Domingo',
			1: 'Lunes',
			2: 'Martes',
			3: 'Miércoles',
			4: 'Jueves',
			5: 'Viernes',
			6: 'Sábado'
		},
		year = date.getFullYear(),
		month = months[date.getMonth() as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11],
		day = date.getDate(),
		wDay = days[date.getDay() as 1 | 2 | 3 | 4 | 5 | 6],
		hour = date.getHours().toString().padStart(2, '0'),
		minute = date.getMinutes().toString().padStart(2, '0'),
		second = date.getSeconds().toString().padStart(2, '0');

	return `${wDay} ${day} de ${month} de ${year} - ${hour}:${minute}:${second}`;
}

function T_convertor(ms: number) {
	const años = Math.floor(ms / (1000 * 60 * 60 * 24 * 365));
	const meses = Math.floor((ms % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
	const dias = Math.floor((ms % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
	const horas = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	const minutos = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
	const segundos = Math.floor((ms % (1000 * 60)) / 1000);

	let final1 = '';
	if (años > 0) final1 += años > 1 ? `${años} años, ` : `${años} año, `;
	if (meses > 0) final1 += meses > 1 ? `${meses} meses y ` : `${meses} mes y `;
	if (dias > 0) final1 += dias > 1 ? `${dias} días. ` : `${dias} día. `;
	if (dias < 1 && horas > 0) final1 += horas > 1 ? `${horas} horas, ` : `${horas} hora, `;
	if (dias < 1 && minutos > 0) final1 += minutos > 1 ? `${minutos} minutos y ` : `${minutos} minuto y `;
	if (dias < 1 && segundos > 0) final1 += segundos > 1 ? `${segundos} segundos` : `${segundos} segundo`;
	return final1;
}

function Convert(date: string) {
	const valid_keys = {
		y: { nombre: 'año(s)', tiempo: 31104000000 },
		t: { nombre: 'mes(es)', tiempo: 2592000000 },
		w: { nombre: 'semana(s)', tiempo: 604800000 },
		d: { nombre: 'día(s)', tiempo: 86400000 },
		h: { nombre: 'hora(s)', tiempo: 3600000 },
		m: { nombre: 'minuto(s)', tiempo: 60000 },
		s: { nombre: 'segundo(s)', tiempo: 1000 }
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
		actions: 'Canal {channel} establecido como el canal logs de acciones.',
		infractions: 'Canal {channel} establecido como el canal logs de infracciones.',
		members: 'Canal {channel} establecido como el canal logs de miembros.',
		messages: 'Canal {channel} establecido como el canal logs de mensajes.',
		server: 'Canal {channel} establecido como el canal logs del servidor.',
		voice: 'Canal {channel} establecido como el canal logs de voz.',
		welcome: 'Canal {channel} establecido como el canal bienvenidas.',
		disabled: '👍 Los logs de ese tipo fueron deshabilitados'
	},
	role_set: {
		admin: 'Rol **{role}** establecido como el rol de administrador.\nTen en cuenta que para que funcione debes seleccionar un rol de moderador.',
		mod: 'Rol **{role}** establecido como el rol de moderador.\nTen en cuenta que para que funcione debes seleccionar un rol de administrador.',
		auto: 'Rol **{role}** establecido como el autorole',
		disabled: '👍 Rol deshabilitado'
	},
	only_text: 'El canal que has seleccionado no es de texto',
	antispam_enabled: 'Ok, ¡Sistema antispam activado!',
	antispam_disabled: 'Ok, sistema antispam desactivado.',
	prefix_set: 'Ok, `{prefix}` establecido como nuevo prefijo.',
	current_languages: 'Idiomas disponibles actualmente: `es`, `en`',
	lang_set: 'Ok, {idioma} establecido como nuevo idioma.',
	admin_perm: 'Necesitas el rol de administrador para ejecutar el comando.',
	mod_perm: 'Necesitas el rol de moderador o administrador para ejecutar el comando.',
	required_perms: 'Necesitas los siguientes permisos para ejecutar este comando: ',
	required_args: 'No especificaste los siguientes argumentos: ',
	maybe_not_in_cache: ' (puede que no tenga al usuario en caché, prueba @mencionándole)',
	command_used: ':wrench: {user} ha usado el comando **{command}** en {channel}',
	twitter: {
		follow: function (username, channel, id) {
			return `Recibirás las notificaciones de ${username} (${id}) en <#${channel.id}> en cuanto se reinicie el bot (menos de 12h)`;
		},
		unfollow: function (username) {
			return `No recibirás más notificiones de ${username} en cuanto se reinicie el bot (menos de 12h)`;
		},
		not_following: 'No estás siguiendo a ese usuario, usa `twitter follow username #channel` para seguirle'
	}
} as LanguageFile['config'];

export const kawaii = {
	cuddle: '{author} se acurruca con {member} uwu',
	hug: '{author} le da un abrazo lleno de amor a {member}, qué hermoso',
	kiss: '{member} es besado apasionadamente por {author} :3',
	pat: '{author} acaricia a {member}, nyaa!',
	poke: '{author} molesta un poco a {member} :(',
	slap: '{author} le dio un tortazo a {member} alv :v'
} as LanguageFile['kawaii'];

export const mod = {
	need_id: 'Necesito saber a quién quieres sancionar',
	not_moderatable: 'El usuario que has seleccionado no es moderable por mí. Comprueba sus permisos, si tiene un rol superior...',
	yes: 'Sí',
	no: 'No',
	i_cant: 'No puedo {action} a este usuario.',
	actions: {
		banned: 'baneado',
		kicked: 'expulsado',
		warned: 'advertido',
		muted: 'muteado',
		unbanned: 'desbaneado',
		unmuted: 'desmuteado'
	},
	infraction_md: 'Has sido {action} en {server}. Razón: {reason}',
	infraction: '**{user}** ha sido {action}. Razón: {reason}',
	whose_messages: '¿De quién son los mensajes a borrar?',
	bulkDelete_14d: 'Solo puedes borrar mensajes que son de antes de hace 14 días.',
	delete_infr: 'Ok, infracción {key} eliminada.',
	embed: {
		embed_code: 'Necesitas incluir el código JSON del embed o mira el ejemplo del comando usando `command embed` (https://phodit.net/embedbuilder/).',
		create_embed: '\nPara saber cómo usar el comando, puedes usar `embed help`',
		how_it_works:
			'**Cómo usar el comando EMBED**\nEl comando `embed` puede funcionar de dos formas, la primera, usando el código JSON del embed (https://phodit.net/embedbuilder/), y la segunda es separando lo que quieras en el embed con **|**\nUn ejemplo sería `embed title: título del embed | description: descripción del embed | fields: [{"name": "título del primer campo", "value": "valor del primer campo" }, ...]`\n Este es un ejemplo sencillo, le puedes añadir muchas más cosas al embed (title, description, fields, footer, thumbnail, image y color). No tienen por qué ir en orden, puedes ordenarlo como quieras.\nEsta ha sido la ayuda para el comando EMBED, si necesitas más ayuda, puedes preguntar en el servidor de soporte (t-support)'
	},
	user_404: 'No pude encontrar a algún usuario con id {id}',
	user_infrs: 'Infracciones de {user} ```ml\nTipo | Moderador | Razón | Duración | ¿Activa? | Fecha | Infr ID \n ------------------------------------',
	infrs_404: 'El usuario proporcionado no tiene infracciones.',
	channel_lock: 'El envío de mensajes en este canal ha sido denegado para `{role}`',
	channel_unlock: 'El envío de mensajes en este canal ha sido restablecido para `{role}`',
	temp_infr_md: 'Has sido {action} en {server}. Razón: {reason} | Tiempo: {time}',
	temp_infr: '{user} ha sido {action}. Razón: {reason} | Tiempo: {time}',
	time_404: 'Necesitas incluir el tiempo que será sancionado',
	has_role: '{member} ya tiene el rol {role}.',
	role_added: '{member} recibió el rol {role}',
	role_404: 'El rol que seleccionaste no existe o es superior al mío',
	has_role_nt: '{member} no tiene el rol {role}',
	role_removed: '{role} fue removido de {member}',
	need_reason: 'Necesitas incluir la razón de la sanción',
	which_edit: '¿Qué quieres editar de la sanción?',
	antispam: 'has sido muteado por spamear.',
	infraction_created: '**{infr}**\nUsuario: `{user}`\nModerador: `{mod}`\nID: `{id}`\nTiempo: `{time}`\nRazón: `{reason}`',
	modinf: 'Infracción {infr} modificada.',
	mkick: '{count} usuarios fueron expulsados',
	mban: '{count} usuarios fueron baneados',
	no_muted_role: 'No existe un rol llamado "Trimuted" en el servidor, usa el comando `mute` al menos una vez para crearlo.',
	timeout: {
		clear: 'El timeout de {member} fue removido',
		timeout: '{member} recibió un timeout de {duration}. Razón: {reason}',
		already_timed_out: 'Ese usuario ya tiene un timeout. Si quieres removérselo, usa el mismo comando poniendo la duración a 0.',
		time: 'La duración no debe ser superior a 28 días.'
	}
} as LanguageFile['mod'];

export const welcome = {
	wcolor: 'Ok, {color} establecido como color de texto de bienvenida.',
	wimage: 'Ok, imagen establecida como imagen de bienvenida.',
	wmessage: 'Ok, texto establecido como texto de bienvenida.',
	channel: 'Ok, canal {channel} establecido como canal de bienvenidas.',
	hex: 'Tiene que ser un hexadecimal (incluyendo #)',
	need_url: 'Debes añadir la imagen vía url al comando'
} as LanguageFile['welcome'];

export const functions = {
	Convert: Convert,
	convertDate: convertDate,
	T_convertor: T_convertor
} as LanguageFile['functions'];

export const music = {
	loop: {
		enabled: '🔁 Loop activado',
		disabled: '🔁 Loop desactivado'
	},
	shuffle: {
		enabled: '🔀 Modo aleatorio activado',
		disabled: '🔀 Modo aleatorio desactivado'
	},
	autoplay: {
		enabled: '⏭️ Autoplay activado',
		disabled: '⏭️ Autoplay desactivado'
	},
	pause: '⏸ Reproducción pausada (ayuda por favor)',
	resume: '▶ Reproducción continuada',
	tts: {
		file: 'No puedes usar este comando mientras haya un archivo sonando',
		too_long: 'El texto debe tener menos de 200 caracteres.'
	},
	playlists: {
		titles: {
			recent: 'Playlists recientes',
			top: 'Mejores playlists',
			by: 'Playlists hechas por',
			default: 'Tus playlists'
		},
		play: 'Escribe el número de la playlist que desees examinar o `play <número>` para poner esa playlist',
		play_from_other: 'Escribe `play <número>` para poner una playlist',
		song_add_or_remove: 'Para borrar una canción pon `remove <nùmero>`, y si quieres añadir pon `add`.',
		which_song: 'Escribe el nombre de la canción que quieras añadir',
		added_to_playlist: `Canción \`{song}\` añadida a la playlist`,
		removed_from_playlist: `Canción \`{song}\` borrada de la playlist`,
		same_name: 'Ya hay una playlist con ese nombre',
		playlist_created: `Playlist \`{name}\` creada con éxito, añade algunas canciones seleccionándola con \`{prefix}playlist list\``,
		type_to_remove: 'Escribe el número de la playlist que deseas borrar',
		playlist_deleted: `Playlist \`{pl}\` borrada`,
		playlist_songs: 'Canciones de la playlist',
		no_playlists: 'El usuario proporcionado no tiene playlists',
		added_to_queue: 'La playlist está siendo añadida a la cola'
	},
	ytt: {
		yttogether: 'Click aquí para empezar **YouTube Together** en ',
		yt_invited: 'Fuiste invitad@ por **{author}** a una sesión de **YouTube Together**: ',
		yt_nodm: 'No pude enviar un mensaje directo al usuario',
		yt_dm: 'El usuario fue notificado por mensaje directo'
	},
	no_vc: 'No estás en un canal de voz',
	wrong_vc: 'No estás en el mi canal de voz.',
	no_queue: 'No hay ninguna canción en la cola',
	leave_timeout: 'He abandonado el canal de voz porque nadie me estaba escuchando :(',
	lyrics_name: 'Debes poner el nombre de la canción',
	lyrics_not_found: 'No encontré la letra de la canción que pediste. Intenta especificar más (el/la artista...)',
	not_found: 'No se ha encontrado nada.',
	error_nothing_found: 'Ocurrió un error al buscar ese vídeo: ',
	that_video: 'ese vídeo',
	error_stream:
		'Ocurrió un error al intentar reproducir {video}, **es muy probable que el vídeo tenga restricción de edad (y por tanto no pueda ponerlo)**. Más información abajo\n\n',
	length: 'La letra es demasiado larga',
	now_playing: '__Sonando ahora__',
	requested_by: 'Pedida por:',
	playlist: 'Playlist: **{playlist}** fue añadida a la cola',
	queue_songs: '__**Canciones en cola**__',
	queue_page: 'Página {number} de {total}',
	need_qnumber: 'Pon un número para borrarlo de la cola',
	must_be_number: 'Tienes que envíar un número',
	cannot_move: 'No puedes mover la canción que está sonando ahora mismo',
	cannot_remove: 'No puedes borrar esa canción',
	song_moved: '**{song}** fue movida satisfactoriamente',
	song_removed: '**{song}** ha sido removida de la cola',
	song_removed_and_sliced: 'Se ha borrado a partir de esa canción de la cola',
	song_404: 'La cola no tiene ninguna canción con ese número',
	invalid_song: 'Canción invalida, cancelando.',
	song_select: '__**Selección de canciones**__',
	cancel_select: 'Escribe "cancel" si no quieres seleccionar ninguna canción',
	type_a_number: 'Pon un número para escuchar la canción',
	cancel: 'No hubo respuesta. Cancelando...',
	seek: 'Saltando a {time}...',
	seek_cancelled: 'El video finaliza antes de llegar ahí.',
	cannot_seek_files: 'Este comando no está disponible para archivos',
	skip: {
		already_voted: 'Ya has votado para saltar ({votes})',
		skipping: 'Saltando...',
		voting: '¿Saltando? {votes}'
	},
	volume: 'Puse el volumen a {volume}',
	too_much: 'El volumen máximo es de 5',
	skipto_restricted: 'Solamente puedes usar este comando si hay menos de 4 personas en llamada o tienes un rol llamado **DJ**',
	play: {
		added_to_queue: {
			title: '__Añadido a la cola__',
			description: '{song} ha sido añadido a la cola con éxito',
			channel: 'Canal:',
			duration: 'Duración:'
		},
		now_playing: {
			title: '__Sonando__',
			channel: 'Canal:',
			duration: 'Duración:',
			requested_by: 'Pedida por:',
			tts: 'Reproduciendo texto en el canal de voz'
		}
	},
	need_dj: {
		remove: 'Necesitas un rol llamado DJ para borrar la canción de otro usuario',
		move: 'Necesitas un rol llamado DJ para mover la canción de otro usuario',
		stop: 'Necesitas un rol llamado DJ para parar la canción de otro usuario',
		volume: 'Necesitas un rol llamado DJ para cambiar el volumen'
	}
} as LanguageFile['music'];

export const util = {
	user: {
		information: '**__Información__**',
		server: '**__Específico del servidor__**',
		main_info: function (user) {
			// eslint-disable-next-line prettier/prettier
			return `**ID**: ${user.id}\n**Creado**: <t:${Math.floor(user.createdTimestamp / 1000)}:R> **->** <t:${Math.floor(user.createdTimestamp / 1000)}:F>\n**Bot**: ${user.bot ? 'Sí' : 'No'}`;
		},
		server_specific: function (member) {
			return `**Nombre mostrado**: ${member.displayName}\n**Se unió**: <t:${Math.floor(member.joinedTimestamp! / 1000)}:R> **->** <t:${Math.floor(
				member.joinedTimestamp! / 1000
			)}:F>\n**Roles**: ${member.roles.cache
				.sort((b, a) => a.position - b.position)
				.map((r) => `${r}`)
				.join(' ')}`.slice(0, 1000);
		},
		createdString: '🌐 Creación:',
		created: function (user) {
			return `${convertDate(user.createdTimestamp)}. Hace ${T_convertor(Math.floor(Date.now()) - user.createdTimestamp)}`;
		},
		nickname: '📛 Apodo',
		status: {
			dnd: '<:dnd:663871630488895501> No molestar',
			idle: '<:idle:663871377539072011> Ausente',
			online: '<:online:663872345009684481> En línea',
			offline: '<:offline:663871423189876776> Desconectado'
		},
		joinedString: '📥 Entrada:',
		joined: function (user) {
			return `${convertDate(user.joinedTimestamp!)}. Hace ${T_convertor(Math.floor(Date.now()) - user.joinedTimestamp!)}`;
		},
		server_avatar: 'Ver avatar del servidor',
		user_avatar: 'Ver avatar del usuario'
	},
	server: {
		main: function (guild, owner) {
			return `**ID**: ${guild.id}\n**Propietario**: <@${owner.id}> (${owner.user.tag})\n**Creado**: <t:${Math.floor(guild.createdTimestamp / 1000)}:R> -> <t:${Math.floor(
				guild.createdTimestamp / 1000
			)}:F>\n**Miembros**: ${guild.memberCount}`;
		},
		owner: '__Propietario__',
		createdString: '__Creación__',
		members: '__Miembros__',
		region: '__Región__',
		created: function (guild) {
			return `${convertDate(guild.createdTimestamp)}. Hace ${T_convertor(Math.floor(Date.now()) - guild.createdTimestamp)}`;
		}
	},
	manga: {
		type: 'Tipo',
		volumes: 'Volúmenes',
		chapters: 'Capítulos',
		author: 'Autor',
		published: 'Publicado',
		genre: 'Género',
		status: 'Estado',
		ranking: 'Ranking',
		popularity: 'Popularidad'
	},
	cooldown: function (time, command) {
		return `tienes que esperar ${time} segundos para volver a usar el comando \`${command}\``;
	},
	image: {
		title: 'Resultados de la búsqueda',
		footer: 'Página '
	},
	sauce: {
		no_image: 'No pude encontrar ninguna imagen en ese mensaje',
		title: '¡Salsa!',
		more_source: 'Otras fuentes:',
		looks_like: function (result) {
			return `Obtuve resultados con un ${result.header.similarity}% de similaridad: [${decodeURI(result.data.title || result.data.source || result.data.ext_urls[0])}](${
				result.data.ext_urls ? result.data.ext_urls[0] : 'https://discord.com'
			}).`;
		},
		search_sources: function (url) {
			return `<:google:749389813274378241> [Buscar imagen en google](https://www.google.com/searchbyimage?image_url=${url})\n<:yandex:749389643367186573> [Buscar imagen en Yandex (recomendado)](https://yandex.com/images/search?url=${url}&rpt=imageview)\n<:saucenao:785119535454748682> [Buscar imagen en SauceNAO (NSFW)](https://saucenao.com/search.php?url=${url})`;
		}
	},
	remind: function (reason, time) {
		return `Entendido, te recordaré \`${reason}\` en ${Convert(time)?.nombre || time}`;
	},
	timezone: 'La hora actual en {country} es {time}',
	today: {
		title: 'En un día como hoy',
		see_more: '❯ Ver Más'
	},
	translate: {
		title: 'Traducción',
		from: 'De',
		to: 'A',
		not_found: 'Idioma no encontrado, usa `translate list` para ver la lista de idiomas',
		text_not_found: 'No pude encontrar texto en ese mensaje'
	},
	map: {
		too_much_zoom: 'Alcanzaste el zoom máximo permitido',
		too_little_zoom: 'Alcanzaste el zoom mínimo permitido',
		street: 'Nombre de la calle',
		zipcode: 'Código postal',
		city: 'Ciudad',
		state: 'Estado',
		country: 'País',
		found: function (results, current) {
			return `Encontré ${results.length} resultados. Mostrando el ${current}`;
		}
	},
	feedback: {
		title: '¿Le quieres dar un título a tu comentario?',
		comment: '¿Qué quieres hacer saber al desarrollador?',
		main: 'Tus comentarios son muy importantes para ayudar al desarrollador a mejorar al bot. Si quieres enviar feedback, pulsa el botón.',
		send_feedback: 'Enviar feedback',
		thank_you: 'Gracias por tu feedback.'
	},
	loading: '<a:loading:735243076758667275> Procesando...',
	nsfw: 'Este canal no es NSFW, usa el comando en uno que lo sea',
	invite: {
		title: '¡Invítame a tu servidor!',
		description: `Un bot útil e interactivo que se esfuerza por hacer de tu servidor un lugar mejor.\n> [Invitación recomendada]({invite_link})\n> [Invitación sin permisos]({invite_link_np})\n Si necesitas ayuda, no dudes en pasarte por el [servidor de soporte](${configFile.support_server_invite}) y preguntar alli.`
	},
	horse_race: {
		title: 'Carrera de caballos',
		description: 'Va a dar comienzo una carrera de caballos en 15 segundos. Que cada participante escoja el caballo al que quiera apostar.',
		started: 'La carrera de caballos dará comienzo',
		list: 'Caballos disponibles:',
		selected: 'Selección confirmada',
		no_bets: 'Lo siento, no puedo iniciar una carrera sin apuestas',
		win: 'Y los ganadores son... **{users}**!',
		img: 'https://cdn.discordapp.com/attachments/487962590887149603/714123875549446144/leaderboard.png'
	},
	help: {
		title: 'Comandos',
		description: 'Si necesitas ayuda para algún comando en específico usa {prefix} command <comando>',
		fields: {
			info: '❯ Información',
			util: '❯ Utilidades',
			image_manipulation: '❯ Manipulación de imágenes',
			social: '❯ Social',
			music: '❯ Música',
			fun: '❯ Diversión',
			mod: '❯ Moderación',
			config: '❯ Configuración'
		},
		footer: ' comandos.'
	},
	invalid_user: 'No has proporcionado un usuario válido',
	similar_commands: '**Hmmmm, parece que has intentado ejecutar un comando.**\nPulsa en el botón con el nombre del comando que quieras usar o X si no es ninguno de estos.',
	command_selected: 'Comando ejecutado 👍',
	none_selected: 'Entendido, cerrando interacción',
	about: `¡Un bot de Discord con muchos comandos y de código abierto!\n\n**{username}** se esfuerza por hacer tu servidor un lugar mejor teniendo un montón de comandos útiles e interactivos para casi todo lo que necesites.\nPuedes encontrar el código fuente en: https://github.com/k2helix/trihammer\n\n> [Invitación recomendada]({invite_link})\n> [Invitación sin permisos]({invite_link_np})\n\nSi necesitas ayuda, no dudes en unirte al [servidor de soporte](${configFile.support_server_invite}) y preguntar ahí.\nActualmente sirviendo para **{guilds} servidores** y **{members} miembros en caché**.`,
	game: {
		release: 'Fecha de salida:',
		genres: 'Géneros:',
		price: 'Precio:',
		publishers: 'Distribuidores',
		not_found: 'No pude encontrar ese juego en Steam',
		show_dlcs: 'Mostrar DLCs'
	},
	convert: {
		need: 'Debe ser {prefix}convert <cantidad> <unidad base> <unidad objetivo> (separado por espacios)',
		success: '{amount} {base} son {number} {target}'
	},
	tiktok:
		'__**Publicaciones de {user}**__\n{videoUrl}\n{mainComment}\n**♥️ Likes**: {likes}\n**👁️ Visualizaciones**: {views}\n**👁‍🗨 Comentarios**: {comments}\nPublicación {current} de {total}\n{date}',
	connect4: {
		bot: 'no se puede jugar contra bots.',
		challenge: ', aceptas el desafío? (yes o no)',
		unverified: 'Parece que no ha aceptado...',
		waiting: 'Esperando una respuesta...',
		success: '¡Respuesta recibida! ¡Buena suerte!',
		column: ', qué columna eliges? Escribe `end` para finalizar.',
		tictactoe: 'Escribe la fila seguida de la columna que quieras, por ejemplo 1 3',
		timeout: 'Te quedaste sin tiempo...',
		inactivity: 'Partida finalizada por inactividad',
		win: '¡Felicidades, ',
		draw: 'Parece que es un empate...'
	},
	command: {
		not_found: 'No pude encontrar un comando con ese nombre o alias',
		title: 'Comando',
		fields: {
			usage: 'Uso',
			required_perms: 'Permisos requeridos',
			required_roles: 'Roles requeridos',
			alias: 'Alias'
		},
		footer: 'Los campos entre <> son obligatorios, mientras que entre [] son opcionales.'
	},
	anime: {
		nothing_selected: 'Nada seleccionado',
		you_cant: 'No puedes seleccionar si no usaste tú el comando.',
		episodes: 'Episodios',
		status: 'Estado',
		aired: 'Emitido',
		genre: 'Género',
		studio: 'Estudio',
		source: 'Basado en',
		duration: 'Duración de episodios',
		ranking: 'Ranking',
		popularity: 'Popularidad',
		footer: 'Extraído de MyAnimeList',
		type_a_number: 'Pon un número para seleccionar',
		screenshot: {
			no_image: 'Necesitas enviar una imagen o enlace a la imagen',
			similarity: 'Semejanza:',
			at: 'En:',
			more_results: 'Más resultados:'
		}
	}
} as LanguageFile['util'];

export const xp = {
	lvlroles: {
		show: 'Roles de experiencia',
		remove: 'Uso incorrecto, leveledroles [remove] <role id> <level>',
		add: 'Uso incorrecto, leveledroles <role id> <level>',
		no_roles: 'Este servidor no tiene roles de experiencia',
		removed: 'Rol borrado de la lista de roles de experiencia satisfactoriamente',
		added: 'Rol añadido a la lista de roles de experiencia satisfactoriamente'
	},
	rep: {
		cooldown: function (time, prefix) {
			return `Tienes que esperar ${T_convertor(
				time
			)} para volver a dar reputación. (¡O puedes votar por mí en top.gg y usar \`${prefix}rep reset\` para resetear el cooldown! https://top.gg/bot/611710846426415107/vote)`;
		},
		added: '**{author}** ha dado un punto de reputación a **{user}**',
		user: 'Debes mencionar a quien quieras darle tu punto de reputación',
		reset: 'Tu cooldown ha sido reseteado, gracias por votar por mí <3',
		no_reset: 'Parece que aún no has votado por mí en top.gg (https://top.gg/bot/611710846426415107/vote)'
	},
	lvlup: '¡Enhorabuena, {user}, has conseguido el rol {role}! :tada:',
	no_perms: 'No tienes permiso de usar este comando',
	need_lvl: 'El nivel debe ser un número',
	level_set: 'Establecido el nivel de **{user}** a **{level}**'
} as LanguageFile['xp'];

export const other = {
	need_perm: {
		channel: 'Necesito tener permiso de {perms} en este canal para ejecutar ese comando.',
		guild: 'Necesito tener permiso de {perms} en el servidor para ejecutar ese comando.',
		attach_files: 'Necesitas tener permiso de subir archivos para ejecutar ese comando'
	},
	error: 'Ocurrió un error al ejecutar ese comando: ',
	mention: 'Mi prefijo es `{prefix}`, si necesitas ayuda usa `{prefix}help`'
} as LanguageFile['other'];

export const events = {
	voice: {
		joined: ':blue_circle: {user} se ha unido al canal de voz {channel}',
		left: ':red_circle: {user} ha abandonado el canal de voz {channel}',
		moved: ':orange_circle: {user} ha abadonado el canal de voz {oldChannel} y se ha unido al canal de voz {newChannel}'
	},
	user: {
		name: 'El usuario {oldUser} ha cambiado de nombre de usuario, antes era `{oldUser}` y ahora es `{newUser}`.'
	},
	role: {
		update: {
			added: 'Los permisos del rol {role} han sido actualizados, se les ha añadido: `{perms}`',
			removed: 'Los permisos del rol {role} han sido actualizados, se les ha removido: `{perms}`',
			both: 'Los permisos del rol {role} han sido actualizados, se les ha añadido: `{added}`. Se le ha removido: `{removed}`',
			none: 'Un rol ha sido actualizado: {role}'
		},
		delete: 'Un rol ha sido borrado: `{role}`',
		create: 'Un rol ha sido creado: `{role}`'
	},
	message: {
		update: 'Mensaje de {user} editado en {channel}',
		from: 'De:',
		to: 'A:',
		delete: 'Mensaje de {author} borrado en {channel}:\n```{content}```',
		deleteBulk: {
			deleted: '{messages} mensajes borrados',
			showing: 'Mostrando {amount} de {total} caracteres.'
		}
	},
	member: {
		update: {
			role_added: 'Rol añadido a {member}: {role}',
			role_removed: 'Rol removido a {member}: {role}',
			nickname: 'El apodo de {member} ha cambiado de `{old}` a `{new}`'
		},
		remove: function (member) {
			return `:red_circle: El usuario ${member.user.tag} ha abandonado el servidor, se unió el <t:${Math.floor(member.joinedTimestamp! / 1000)}>`;
		},
		add: function (user) {
			return `:blue_circle: ${user.tag} ha entrado al servidor, creado <t:${Math.floor(user.createdTimestamp / 1000)}:R>`;
		}
	},
	channel: {
		update: {
			added: 'Los permisos del rol {role} en el canal {channel} han cambiado, se le ha añadido: `{perms}`',
			removed: 'Los permisos del rol {role} en el canal {channel} han cambiado, se le ha removido: `{perms}`',
			both: 'Los permisos del rol {role} en el canal {channel} han cambiado, se le ha añadido: `{added}`. Se le ha removido `{removed}`'
		},
		delete: 'Un canal ha sido borrado: `{name}`',
		create: 'Un canal ha sido creado: `{name}`'
	}
} as LanguageFile['events'];
