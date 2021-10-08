function convertDate(ms) {
	let date = new Date(ms),
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
		month = months[date.getMonth()],
		day = date.getDate(),
		wDay = days[date.getDay()],
		hour = date.getHours(),
		minute = date.getMinutes(),
		second = date.getSeconds();
	if (second < 10) second = '0' + second;
	if (minute < 10) minute = '0' + minute;
	if (hour < 10) hour = '0' + hour;

	return `${wDay} ${day} de ${month} de ${year} - ${hour}:${minute}:${second}`;
}

function T_convertor(ms) {
	let años = Math.floor(ms / (1000 * 60 * 60 * 24 * 365));
	let meses = Math.floor((ms % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
	let dias = Math.floor((ms % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
	let horas = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	let minutos = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
	let segundos = Math.floor((ms % (1000 * 60)) / 1000);

	let final1 = '';
	if (años > 0) final1 += años > 1 ? `${años} años, ` : `${años} año, `;
	if (meses > 0) final1 += meses > 1 ? `${meses} meses y ` : `${meses} mes y `;
	if (dias > 0) final1 += dias > 1 ? `${dias} días. ` : `${dias} día. `;
	if (dias < 1 && horas > 0) final1 += horas > 1 ? `${horas} horas, ` : `${horas} hora, `;
	if (dias < 1 && minutos > 0) final1 += minutos > 1 ? `${minutos} minutos y ` : `${minutos} minuto y `;
	if (dias < 1 && segundos > 0) final1 += segundos > 1 ? `${segundos} segundos` : `${segundos} segundo`;
	return final1;
}

function Convert(date) {
	let valid_keys = {
		y: { nombre: 'año(s)', tiempo: 31104000000 },
		t: { nombre: 'mes(es)', tiempo: 2592000000 },
		w: { nombre: 'semana(s)', tiempo: 604800000 },
		d: { nombre: 'día(s)', tiempo: 86400000 },
		h: { nombre: 'hora(s)', tiempo: 3600000 },
		m: { nombre: 'minuto(s)', tiempo: 60000 },
		s: { nombre: 'segundo(s)', tiempo: 1000 }
	};
	if (!date) return;
	let format = date.slice(-1),
		time = date.slice(0, -1);

	if (!valid_keys[format]) return false;
	if (isNaN(time)) return false;
	if (parseInt(time) <= 0) return false;
	return {
		nombre: `${parseInt(time)} ${valid_keys[format].nombre}`,
		tiempo: valid_keys[format].tiempo * parseInt(time)
	};
}
module.exports = {
	config: {
		channel_set: 'Ok, canal {channel} establecido como el canal logs de {logs}.',
		role_set: 'Ok, rol {role} establecido como el rol de {type}.',
		antispam_enabled: 'Ok, ¡Sistema antispam activado!',
		antispam_disabled: 'Ok, sistema antispam desactivado.',
		prefix_set: 'Ok, {prefix} establecido como nuevo prefijo.',
		current_languages: 'Idiomas disponibles actualmente: `es`, `en`',
		lang_set: 'Ok, {idioma} establecido como nuevo idioma.',
		admin_perm: 'Necesitas el rol de administrador para ejecutar el comando.',
		mod_perm: 'Necesitas el rol de moderador o administrador para ejecutar el comando.',
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
	},
	kawaii: {
		cuddle: '{author} se acurruca con {member} uwu',
		hug: '{author} le da un abrazo lleno de amor a {member}, qué hermoso',
		kiss: '{member} es besado apasionadamente por {author} :3',
		pat: '{author} acaricia a {member}, nyaa!',
		poke: '{author} molesta un poco a {member} :(',
		slap: '{author} le dio un tortazo a {member} alv :v'
	},
	mod: {
		need_id: 'Necesito saber a quién quieres sancionar',
		yes: 'Sí',
		i_cant: 'No puedo {action} a este usuario.',
		infraction_md: 'Has sido {action} en {server}. Razón: {reason}',
		infraction: '{user} ha sido {action}. Razón: {reason}',
		whose_messages: '¿De quién son los mensajes a borrar?',
		bulkDelete_14d: 'Solo puedes borrar mensajes que son de antes de hace 14 días.',
		delete_infr: 'Ok, infracción {key} eliminada.',
		embed: {
			embed_code: 'Necesitas incluir el código JSON del embed o mira el ejemplo del comando usando `command embed` (https://phodit.net/embedbuilder/).',
			create_embed: '\nPara saber cómo usar el comando, puedes usar `embed help`',
			how_it_works:
				'**Cómo usar el comando EMBED**\nEl comando `embed` puede funcionar de dos formas, la primera, usando el código JSON del embed (https://phodit.net/embedbuilder/), y la segunda es separando lo que quieras en el embed con **|**\nUn ejemplo sería `embed title: título del embed | description: descripción del embed | fields: [{"name": "título del primer campo", "value": "valor del primer campo" }, ...]`\n Este es un ejemplo sencillo, le puedes añadir muchas más cosas al embed (title, description, fields, footer, thumbnail, image y color). No tienen por qué ir en orden, lo único necesario es que el título sea lo primero, después, puedes ordenarlo como quieras.\nEsta ha sido la ayuda para el comando EMBED, si necesitas más ayuda, puedes preguntar en el servidor de soporte (t-support)'
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
		role_404: 'No pude encontrar a un rol con nombre o id {id}',
		has_role_nt: '{member} no tiene el rol {role}',
		role_removed: '{role} fue removido de {member}',
		need_reason: 'Necesitas incluir la razón de la sanción',
		which_edit: '¿Qué quieres editar de la sanción?',
		antispam: 'has sido muteado por spamear.',
		infraction_created: '**{infr}**\nUsuario: `{user}`\nModerador: `{mod}`\nID: `{id}`\nTiempo: `{time}`\nRazón: `{reason}`',
		modinf: 'Infracción {infr} modificada.',
		mkick: '{count} usuarios fueron expulsados',
		mban: '{count} usuarios fueron baneados'
	},
	welcome: {
		wcolor: 'Ok, {color} establecido como color de texto de bienvenida.',
		wimage: 'Ok, imagen establecida como imagen de bienvenida.',
		wmessage: 'Ok, texto establecido como texto de bienvenida.',
		channel: 'Ok, canal {channel} establecido como canal de bienvenidas.',
		hex: 'Tiene que ser un hexadecimal (incluyendo #)',
		need_url: 'Debes añadir la imagen vía url al comando'
	},
	functions: {
		Convert(date) {
			let valid_keys = {
				y: { nombre: 'año(s)', tiempo: 31104000000 },
				t: { nombre: 'mes(es)', tiempo: 2592000000 },
				w: { nombre: 'semana(s)', tiempo: 604800000 },
				d: { nombre: 'día(s)', tiempo: 86400000 },
				h: { nombre: 'hora(s)', tiempo: 3600000 },
				m: { nombre: 'minuto(s)', tiempo: 60000 },
				s: { nombre: 'segundo(s)', tiempo: 1000 }
			};
			if (!date) return;
			let format = date.slice(-1),
				time = date.slice(0, -1);

			if (!valid_keys[format]) return false;
			if (isNaN(time)) return false;
			if (parseInt(time) <= 0) return false;
			return {
				nombre: `${parseInt(time)} ${valid_keys[format].nombre}`,
				tiempo: valid_keys[format].tiempo * parseInt(time)
			};
		}
	},
	music: {
		loop: {
			enabled: '🔁 Loop activado',
			disabled: '🔁 Loop desactivado'
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
			no_playlists: 'El usuario proporcionado no tiene playlists'
		},
		ytt: {
			yttogether: 'Click aquí para empezar **YouTube Together** en ',
			yt_invited: 'Fuiste invitad@ por **{author}** a una sesión de **YouTube Together**: ',
			yt_nodm: 'No pude enviar un mensaje directo al usuario',
			yt_dm: 'El usuario fue notificado por mensaje directo'
		},
		no_vc: 'No estás en un canal de voz',
		no_queue: 'No hay ninguna canción en la cola',
		lyrics_name: 'Debes poner el nombre de la canción',
		not_found: 'No se ha encontrado nada.',
		length: 'La letra es demasiado larga',
		now_playing: '**🎶 Sonando ahora:**',
		requested_by: 'Pedida por:',
		playlist: 'Playlist: **{playlist}** fue añadida a la cola',
		queue_songs: '__**Canciones en cola:**__',
		queue_page: 'Página {number} de {total}',
		need_qnumber: 'Pon un número para borrarlo de la cola',
		must_be_number: 'Tienes que envíar un número',
		cannot_remove: 'No puedes borrar esa canción',
		song_removed: '{song} ha sido removida de la cola',
		song_404: 'La cola no tiene ninguna canción con ese número',
		invalid_song: 'Canción invalida, cancelando.',
		song_select: '__**Selección de canciones**__',
		cancel_select: 'Escribe "cancel" si no quieres seleccionar ninguna canción',
		type_a_number: 'Pon un número para escuchar la canción',
		cancel: 'No hubo respuesta. Cancelando...',
		seek: 'Saltando a {time}...',
		seek_cancelled: 'El video finaliza antes de llegar ahí.',
		skip: {
			already_voted: 'Ya has votado para saltar ({votes})',
			skipping: 'Saltando...',
			voting: '¿Saltando? {votes}'
		},
		volume: 'Puse el volumen a {volume}',
		play: {
			added_to_queue: {
				title: '**__Añadido a la cola__**',
				description: '{song} ha sido añadido a la cola con éxito',
				channel: 'Canal:',
				duration: 'Duración:'
			},
			now_playing: {
				title: '🎶 **Sonando** 🎶',
				channel: 'Canal:',
				duration: 'Duración:',
				requested_by: 'Pedida por:',
				tts: 'Sonando'
			}
		},
		need_dj: {
			remove: 'Necesitas un rol llamado DJ para borrar la canción de otro usuario',
			stop: 'Necesitas un rol llamado DJ para parar la canción de otro usuario',
			volume: 'Necesitas un rol llamado DJ para cambiar el volumen'
		}
	},
	util: {
		user: {
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
				return `${convertDate(user.joinedTimestamp)}. Hace ${T_convertor(Math.floor(Date.now()) - user.joinedTimestamp)}`;
			}
		},
		server: {
			owner: '👑 Propietario',
			createdString: '📆 Creación',
			members: '👥 Miembros',
			region: '🗺️ Región',
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
			looks_like: function (url, result) {
				return `Obtuve resultados con un ${result.header.similarity}% de similaridad: [${decodeURI(result.data.title || result.data.source || result.data.ext_urls[0])}](${
					result.data.ext_urls ? result.data.ext_urls[0] : 'https://discord.com'
				}).`;
			},
			search_sources: function (url) {
				return `<:google:749389813274378241> [Buscar imagen en google](https://www.google.com/searchbyimage?image_url=${url})\n<:yandex:749389643367186573> [Buscar imagen en Yandex (recomendado)](https://yandex.com/images/search?url=${url}&rpt=imageview)\n<:saucenao:785119535454748682> [Buscar imagen en SauceNAO (NSFW)](https://saucenao.com/search.php?url=${url})`;
			}
		},
		remind: function (reason, time) {
			return `Entendido, te recordaré \`${reason}\` en ${Convert(time).nombre || time}`;
		},
		timezone: 'La hora actual en {country} es {time}',
		today: {
			title: 'En un día como hoy...',
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
			street: 'Nombre de la calle',
			zipcode: 'Código postal',
			city: 'Ciudad',
			state: 'Estado',
			country: 'País',
			found: function (results, current) {
				return `Encontré ${results.length} resultados. Mostrando el ${current}`;
			}
		},
		loading: '<a:loading:735243076758667275> Procesando...',
		nsfw: 'Este canal no es NSFW, usa el comando en uno que lo sea',
		invite: {
			title: '¡Invítame a tu servidor!',
			description:
				'Un bot útil e interactivo que se esfuerza por hacer de tu servidor un lugar mejor.\n> [Invitación recomendada](https://discord.com/oauth2/authorize?client_id=611710846426415107&permissions=8&scope=bot%20applications.commands)\n> [Invitación sin permisos](https://discord.com/oauth2/authorize?client_id=611710846426415107&permissions=0&scope=bot%20applications.commands)\n Si necesitas ayuda, no dudes en pasarte por el [servidor de soporte](https://discord.gg/EjG6XZs) y preguntar alli.'
		},
		horse_race: {
			choose_horse: '**escoge un caballo al que apostar:** _(Escribe el número)_',
			no_bets: 'lo siento, no puedo iniciar una carrera sin apuestas',
			win: 'felicidades, ¡has ganado!',
			lose: 'mejor suerte la próxima vez...',
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
		game: {
			release: 'Fecha de salida:',
			genres: 'Géneros:',
			price: 'Precio:',
			publishers: 'Distribuidores',
			not_found: 'No pude encontrar ese juego en Steam ni la PS Store'
		},
		convert: {
			need: 'Debe ser {prefix}convert <cantidad> <unidad base> <unidad objetivo> (separado por espacios)',
			success: '{amount} {base} son {number} {target}'
		},
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
				usage: '❯ Uso',
				example: '❯ Ejemplo de uso',
				alias: '❯ Alias'
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
	},
	xp: {
		lvlroles: {
			show: 'Roles de experiencia',
			remove: 'Uso incorrecto, leveledroles [remove] <role id> <level>',
			add: 'Uso incorrecto, leveledroles <role id> <level>',
			no_roles: 'Este servidor no tiene roles de experiencia'
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
		need_lvl: 'El nivel debe ser un número'
	},
	other: {
		need_perm: {
			channel: 'Necesito tener permiso de {perms} en este canal para ejecutar ese comando.',
			guild: 'Necesito tener permiso de {perms} en el servidor para ejecutar ese comando.',
			attach_files: 'Necesitas tener permiso de subir archivos para ejecutar ese comando'
		},
		error: 'Ocurrió un error al ejecutar ese comando: ',
		mention: 'Mi prefijo es `{prefix}`, si necesitas ayuda usa `{prefix}help`'
	},
	events: {
		voice: {
			joined: ':green_circle: {user} se ha unido al canal de voz {channel}',
			left: ':red_circle: {user} ha abandonado el canal de voz {channel}',
			moved: ':orange_circle: {user} ha abadonado el canal de voz {oldChannel} y se ha unido al canal de voz {newChannel}'
		},
		user: {
			name: 'El usuario {oldUser} ha cambiado de nombre de usuario, antes era `{oldUser}` y ahora es `{newUser}`.'
		},
		role: {
			update: {
				added: '{user} ha actualizado los permisos del rol `{role}`, se le ha añadido: `{perms}`',
				removed: '{user} ha actualizado los permisos del rol `{role}`, se le ha removido: `{perms}`',
				both: '{user} ha actualizado los permisos del rol `{role}`, se le ha añadido: `{added}`. Se le ha removido: `{removed}`',
				none: 'Un rol ha sido actualizado: `{role}`'
			},
			delete: '{user} ha borrado un rol: {role}',
			create: '{user} ha creadp un rol: {role}'
		},
		message: {
			update: 'Mensaje de {user} editado en {channel}.\nAntes:\n```{old}```Después:\n```{new}```',
			delete: 'Mensaje de {author} borrado en {channel}:\n{content}',
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
				return `:red_circle: El usuario ${member.user.tag} ha abandonado el servidor, se unió el ${convertDate(member.joinedTimestamp)}`;
			},
			add: function (user) {
				return `:green_circle: ${user.tag} ha entrado al servidor, creado hace ${T_convertor(Math.floor(Date.now()) - user.createdTimestamp)}`;
			}
		},
		channel: {
			update: {
				added: '{user} ha cambiado los permisos del rol `{role}` en el canal {channel}, se le ha añadido: `{perms}`',
				removed: '{user} ha cambiado los permisos del rol `{role}` en el canal {channel}, se le ha removido: `{perms}`',
				both: '{user} ha cambiado los permisos del rol `{role}` en el canal {channel}, se le ha añadido: `{added}`. Se le ha removido `{removed}`'
			},
			delete: '{user} ha borrado un canal de tipo {channel}: {name}',
			create: '{user} ha creado un canal de tipo {channel}: {name}'
		}
	}
};
