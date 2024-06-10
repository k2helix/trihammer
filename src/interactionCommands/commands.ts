import { ApplicationCommandDataResolvable, ApplicationCommandOptionType, ApplicationCommandType } from 'discord.js';
const commands: ApplicationCommandDataResolvable[] = [
	{
		name: 'set',
		description: "Set the bot's configuration in the server",
		description_localizations: {
			'es-ES': 'Establece la configuración del bot en el servidor'
		},
		options: [
			{
				name: 'autorole',
				description: 'Set the given role when someone joins',
				description_localizations: {
					'es-ES': 'Establece el rol a dar cuando se una alguien'
				},
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'role',
						type: ApplicationCommandOptionType.Role,
						description: 'The new autorole',
						description_localizations: {
							'es-ES': 'El nuevo autorol'
						},
						required: true
					}
				]
			},
			{
				name: 'admin-role',
				description: 'Set the admin role',
				description_localizations: {
					'es-ES': 'Establece el rol de administrador'
				},
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'role',
						type: ApplicationCommandOptionType.Role,
						description: 'The new admin role',
						description_localizations: {
							'es-ES': 'El nuevo rol de administrador'
						},
						required: true
					}
				]
			},
			{
				name: 'mod-role',
				description: 'Set the moderator role',
				description_localizations: {
					'es-ES': 'Establece el rol de moderador'
				},
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'role',
						type: ApplicationCommandOptionType.Role,
						description: 'The new moderator role',
						description_localizations: {
							'es-ES': 'El nuevo rol de moderador'
						},
						required: true
					}
				]
			},
			{
				name: 'prefix',
				description: "Set the bot's prefix",
				description_localizations: {
					'es-ES': 'Establece el prefijo del bot'
				},
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'prefix',
						type: ApplicationCommandOptionType.String,
						description: 'The new prefix',
						description_localizations: {
							'es-ES': 'El nuevo prefijo'
						},
						required: true
					}
				]
			},
			{
				name: 'language',
				description: "Set the bot's language in the server",
				description_localizations: {
					'es-ES': 'Establece el idioma del bot en el servidor'
				},
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'language',
						type: ApplicationCommandOptionType.String,
						description: 'The new language',
						description_localizations: {
							'es-ES': 'El nuevo idioma'
						},
						required: true,
						choices: [
							{
								name: 'Spanish (español)',
								value: 'es'
							},
							{
								name: 'English',
								value: 'en'
							}
						]
					}
				]
			},
			{
				name: 'welcome',
				description: 'Set the welcome config',
				description_localizations: {
					'es-ES': 'Establece la configuración de bienvenida'
				},
				type: ApplicationCommandOptionType.SubcommandGroup,
				options: [
					{
						name: 'channel',
						type: ApplicationCommandOptionType.Subcommand,
						description: 'The welcome channel',
						description_localizations: {
							'es-ES': 'El canal de bienvenida'
						},
						required: false,
						options: [
							{
								name: 'channel',
								type: ApplicationCommandOptionType.Channel,
								description: 'The new channel',
								description_localizations: {
									'es-ES': 'El nuevo canal'
								},
								required: true
							}
						]
					},
					{
						name: 'color',
						type: ApplicationCommandOptionType.Subcommand,
						description: 'The welcome title color',
						description_localizations: {
							'es-ES': 'El color del título de bienvenida'
						},
						required: false,
						options: [
							{
								name: 'color',
								type: ApplicationCommandOptionType.String,
								description: 'The new color',
								description_localizations: {
									'es-ES': 'El nuevo color'
								},
								required: true
							}
						]
					},
					{
						name: 'image',
						type: ApplicationCommandOptionType.Subcommand,
						description: 'The welcome background image',
						description_localizations: {
							'es-ES': 'La imagen de fondo de bienvenida'
						},
						required: false,
						options: [
							{
								name: 'image',
								type: ApplicationCommandOptionType.String,
								description: 'The new image URL',
								description_localizations: {
									'es-ES': 'La nueva URL de la imagen'
								},
								required: false
							},
							{
								name: 'attachment',
								type: ApplicationCommandOptionType.Attachment,
								description: 'Use this if you want to select the uploaded file',
								description_localizations: {
									'es-ES': 'Usa esto si quieres seleccionar un archivo'
								},
								required: false
							}
						]
					},
					{
						name: 'message',
						type: ApplicationCommandOptionType.Subcommand,
						description: 'The welcome message',
						description_localizations: {
							'es-ES': 'El mensaje de bienvenida'
						},
						required: false,
						options: [
							{
								name: 'message',
								type: ApplicationCommandOptionType.String,
								description: 'The new message',
								description_localizations: {
									'es-ES': 'El nuevo mensaje'
								},
								required: true
							}
						]
					}
				]
			},
			{
				name: 'actions-logs',
				description: 'Set the actions logs channel',
				description_localizations: {
					'es-ES': 'Establece el canal de logs de acciones'
				},
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'channel',
						type: ApplicationCommandOptionType.Channel,
						description: 'The new channel',
						description_localizations: {
							'es-ES': 'El nuevo canal'
						},
						required: true
					}
				]
			},
			{
				name: 'infractions-logs',
				description: 'Set the infractions logs channel',
				description_localizations: {
					'es-ES': 'Establece el canal de logs de infracciones'
				},
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'channel',
						type: ApplicationCommandOptionType.Channel,
						description: 'The new channel',
						description_localizations: {
							'es-ES': 'El nuevo canal'
						},
						required: true
					}
				]
			},
			{
				name: 'members-logs',
				description: 'Set the members logs channel',
				description_localizations: {
					'es-ES': 'Establece el canal de logs de miembros'
				},
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'channel',
						type: ApplicationCommandOptionType.Channel,
						description: 'The new channel',
						description_localizations: {
							'es-ES': 'El nuevo canal'
						},
						required: true
					}
				]
			},
			{
				name: 'messages-logs',
				description: 'Set the messages logs channel',
				description_localizations: {
					'es-ES': 'Establece el canal de logs de mensajes'
				},
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'channel',
						type: ApplicationCommandOptionType.Channel,
						description: 'The new channel',
						description_localizations: {
							'es-ES': 'El nuevo canal'
						},
						required: true
					}
				]
			},
			{
				name: 'server-logs',
				description: 'Set the server logs channel',
				description_localizations: {
					'es-ES': 'Establece el canal de logs del servidor'
				},
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'channel',
						type: ApplicationCommandOptionType.Channel,
						description: 'The new channel',
						description_localizations: {
							'es-ES': 'El nuevo canal'
						},
						required: true
					}
				]
			},
			{
				name: 'voice-logs',
				description: 'Set the voice logs channel',
				description_localizations: {
					'es-ES': 'Establece el canal de logs de voz'
				},
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'channel',
						type: ApplicationCommandOptionType.Channel,
						description: 'The new channel',
						description_localizations: {
							'es-ES': 'El nuevo canal'
						},
						required: true
					}
				]
			}
		]
	},
	{
		name: 'search',
		description: 'Search some things on the internet',
		description_localizations: {
			'es-ES': 'Busca diversas cosas en internet'
		},
		options: [
			{
				name: 'anime',
				description: 'Search for an anime',
				description_localizations: {
					'es-ES': 'Busca un anime'
				},
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'query',
						type: ApplicationCommandOptionType.String,
						description: 'The anime to search',
						description_localizations: {
							'es-ES': 'El anime a buscar'
						},
						required: true
					},
					{
						name: 'confirm-result',
						type: ApplicationCommandOptionType.Boolean,
						description: 'Whether or not to let you choose between found results',
						description_localizations: {
							'es-ES': 'Si quieres escoger entre los resultados encontrados'
						},
						required: false
					}
				]
			},
			{
				name: 'manga',
				description: 'Search for a manga',
				description_localizations: {
					'es-ES': 'Busca un manga'
				},
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'query',
						type: ApplicationCommandOptionType.String,
						description: 'The manga to search',
						description_localizations: {
							'es-ES': 'El manga a buscar'
						},
						required: true
					},
					{
						name: 'confirm-result',
						type: ApplicationCommandOptionType.Boolean,
						description: 'Whether or not to let you choose between found results',
						description_localizations: {
							'es-ES': 'Si quieres escoger entre los resultados encontrados'
						},
						required: false
					}
				]
			},
			{
				name: 'image',
				description: 'Search for an image',
				type: ApplicationCommandOptionType.Subcommand,
				description_localizations: {
					'es-ES': 'Busca una imagen'
				},
				options: [
					{
						name: 'query',
						type: ApplicationCommandOptionType.String,
						description: 'The query for the image',
						description_localizations: {
							'es-ES': 'La búsqueda para la imagen'
						},
						required: true
					}
				]
			},
			{
				name: 'game',
				description: 'Search for a game',
				description_localizations: {
					'es-ES': 'Busca un juego'
				},
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'query',
						type: ApplicationCommandOptionType.String,
						description: 'The game you want to search',
						description_localizations: {
							'es-ES': 'El juego que quieres buscar'
						},
						required: true
					},
					{
						name: 'confirm-result',
						type: ApplicationCommandOptionType.Boolean,
						description: 'Whether or not to let you choose between found results',
						description_localizations: {
							'es-ES': 'Si quieres escoger entre los resultados encontrados'
						},
						required: false
					}
				]
			},
			// {
			// 	name: 'location',
			// 	description: 'Search for a location',
			// 	description_localizations: {
			// 		'es-ES': 'Busca una ubicación'
			// 	},
			// 	type: ApplicationCommandOptionType.Subcommand,
			// 	options: [
			// 		{
			// 			name: 'query',
			// 			type: ApplicationCommandOptionType.String,
			// 			description: 'The location you want to search',
			// 			description_localizations: {
			// 				'es-ES': 'La ubicación que quieres buscar'
			// 			},
			// 			required: true
			// 		}
			// 	]
			// },
			{
				name: 'tiktok',
				description: "Search for a user's posts on TikTok",
				description_localizations: {
					'es-ES': 'Busca las publicaciones de un usuario en TikTok'
				},
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'user',
						type: ApplicationCommandOptionType.String,
						description: 'The user you want to search (without @)',
						description_localizations: {
							'es-ES': 'El usuario que quieres buscar (sin @)'
						},
						required: true
					}
				]
			}
		]
	},
	{
		name: 'random',
		description: 'Get a random image of an animal',
		description_localizations: {
			'es-ES': 'Obtén una imagen aleatoría de un animal'
		},
		options: [
			{
				name: 'animal',
				type: ApplicationCommandOptionType.String,
				description: 'The animal of which you want an image',
				description_localizations: {
					'es-ES': 'El animal del que quieres una imagen'
				},
				required: true,
				choices: [
					{
						name: 'bird',
						name_localizations: {
							'es-ES': 'pájaro'
						},
						value: 'bird'
					},
					{
						name: 'cat',
						name_localizations: {
							'es-ES': 'gato'
						},
						value: 'cat'
					},
					{
						name: 'dog',
						name_localizations: {
							'es-ES': 'perro'
						},
						value: 'dog'
					},
					{
						name: 'duck',
						name_localizations: {
							'es-ES': 'pato'
						},
						value: 'duck'
					},
					{
						name: 'fox',
						name_localizations: {
							'es-ES': 'zorro'
						},
						value: 'fox'
					},
					{
						name: 'koala',
						name_localizations: {
							'es-ES': 'koala'
						},
						value: 'koala'
					},
					{
						name: 'panda',
						name_localizations: {
							'es-ES': 'panda'
						},
						value: 'panda'
					}
				]
			}
		]
	},
	{
		name: 'play',
		description: 'Play something with friends',
		description_localizations: {
			'es-ES': 'Juega a algo con amigos'
		},
		options: [
			{
				name: 'connect4',
				description: 'Play connect 4 with a friend',
				description_localizations: {
					'es-ES': 'Juega conecta 4 con un amigo'
				},
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'user',
						type: ApplicationCommandOptionType.User,
						description: 'The friend you want to play with',
						description_localizations: {
							'es-ES': 'La persona con quien quieres jugar'
						},
						required: true
					}
				]
			},
			{
				name: 'tictactoe',
				description: 'Play tictactoe with a friend (beta)',
				description_localizations: {
					'es-ES': 'Juega tres en raya con un amigo (beta)'
				},
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'user',
						type: ApplicationCommandOptionType.User,
						description: 'The friend you want to play with',
						description_localizations: {
							'es-ES': 'La persona con quien quieres jugar'
						},
						required: true
					}
				]
			},
			{
				name: 'horse-race',
				description: 'Play a horse race with friends',
				description_localizations: {
					'es-ES': 'Juega una carrera de caballos con amigos'
				},
				type: ApplicationCommandOptionType.Subcommand
			}
		]
	},
	{
		name: 'infraction',
		description: 'Search, edit or delete infractions',
		description_localizations: {
			'es-ES': 'Busca, edita o borra infracciones'
		},
		options: [
			{
				name: 'search',
				description: 'Search for infractions by a user',
				description_localizations: {
					'es-ES': 'Busca infracciones de un usuario'
				},
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'user',
						type: ApplicationCommandOptionType.User,
						description: 'The user you want to search infractions for',
						description_localizations: {
							'es-ES': 'El usuario del que quieres buscar infracciones'
						},
						required: true
					}
				]
			},
			{
				name: 'modify',
				description: 'Modify an infraction',
				description_localizations: {
					'es-ES': 'Modifica una infracción'
				},
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'id',
						type: ApplicationCommandOptionType.String,
						description: 'The ID of the infraction',
						description_localizations: {
							'es-ES': 'La ID de la infracción'
						},
						required: true
					},
					{
						name: 'duration',
						type: ApplicationCommandOptionType.String,
						description: 'The new duration of the infraction',
						description_localizations: {
							'es-ES': 'La nueva duración de la infracción'
						},
						required: false
					},
					{
						name: 'reason',
						type: ApplicationCommandOptionType.String,
						description: 'The new reason of the infraction',
						description_localizations: {
							'es-ES': 'La nueva razón de la infracción'
						},
						required: false
					}
				]
			},
			{
				name: 'delete',
				description: 'Delete an infraction',
				description_localizations: {
					'es-ES': 'Borra una infracción'
				},
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'id',
						type: ApplicationCommandOptionType.String,
						description: 'The ID of the infraction',
						description_localizations: {
							'es-ES': 'La ID de la infracción'
						},
						required: true
					}
				]
			}
		]
	},
	{
		name: 'image',
		description: 'Apply effects to an image',
		description_localizations: {
			'es-ES': 'Aplica efectos a una imagen'
		},
		options: [
			{
				name: 'contrast',
				description: 'Apply contrast to an image',
				description_localizations: {
					'es-ES': 'Aplica contraste a una imagen'
				},
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'image',
						type: ApplicationCommandOptionType.String,
						description: 'The URL of the image',
						description_localizations: {
							'es-ES': 'La URL de la imagen'
						},
						required: false
					},
					{
						name: 'user-avatar',
						type: ApplicationCommandOptionType.User,
						description: 'The user you want to get the image from',
						description_localizations: {
							'es-ES': 'El usuario de quien quieres la imagen'
						},
						required: false
					},
					{
						name: 'attachment',
						type: ApplicationCommandOptionType.Attachment,
						description: 'Use this if you want to apply the effect to the uploaded file',
						description_localizations: {
							'es-ES': 'Usa esto si quieres aplicar el efecto a un archivo'
						},
						required: false
					}
				]
			},
			{
				name: 'glitch',
				description: 'Apply a glitch effect to an image',
				description_localizations: {
					'es-ES': 'Aplica un efecto de glitch a una imagen'
				},
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'image',
						type: ApplicationCommandOptionType.String,
						description: 'The URL of the image',
						description_localizations: {
							'es-ES': 'La URL de la imagen'
						},
						required: false
					},
					{
						name: 'user-avatar',
						type: ApplicationCommandOptionType.User,
						description: 'The user you want to get the image from',
						description_localizations: {
							'es-ES': 'El usuario de quien quieres la imagen'
						},
						required: false
					},
					{
						name: 'attachment',
						type: ApplicationCommandOptionType.Attachment,
						description: 'Use this if you want to apply the effect to the uploaded file',
						description_localizations: {
							'es-ES': 'Usa esto si quieres aplicar el efecto a un archivo'
						},
						required: false
					}
				]
			},
			{
				name: 'magik',
				description: 'Apply a distort effect to an image',
				description_localizations: {
					'es-ES': 'Aplica un efecto de distorsión a una imagen'
				},
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'image',
						type: ApplicationCommandOptionType.String,
						description: 'The URL of the image',
						description_localizations: {
							'es-ES': 'La URL de la imagen'
						},
						required: false
					},
					{
						name: 'user-avatar',
						type: ApplicationCommandOptionType.User,
						description: 'The user you want to get the image from',
						description_localizations: {
							'es-ES': 'El usuario de quien quieres la imagen'
						},
						required: false
					},
					{
						name: 'attachment',
						type: ApplicationCommandOptionType.Attachment,
						description: 'Use this if you want to apply the effect to the uploaded file',
						description_localizations: {
							'es-ES': 'Usa esto si quieres aplicar el efecto a un archivo'
						},
						required: false
					}
				]
			},
			{
				name: 'grayscale',
				description: 'Change the image colors to gray',
				description_localizations: {
					'es-ES': 'Aplica un efecto de blanco y negro a una imagen'
				},
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'image',
						type: ApplicationCommandOptionType.String,
						description: 'The URL of the image',
						description_localizations: {
							'es-ES': 'La URL de la imagen'
						},
						required: false
					},
					{
						name: 'user-avatar',
						type: ApplicationCommandOptionType.User,
						description: 'The user you want to get the image from',
						description_localizations: {
							'es-ES': 'El usuario de quien quieres la imagen'
						},
						required: false
					},
					{
						name: 'attachment',
						type: ApplicationCommandOptionType.Attachment,
						description: 'Use this if you want to apply the effect to the uploaded file',
						description_localizations: {
							'es-ES': 'Usa esto si quieres aplicar el efecto a un archivo'
						},
						required: false
					}
				]
			},
			{
				name: 'invert',
				description: 'Invert the image colors',
				description_localizations: {
					'es-ES': 'Invierte los colores de una imagen'
				},
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'image',
						type: ApplicationCommandOptionType.String,
						description: 'The URL of the image',
						description_localizations: {
							'es-ES': 'La URL de la imagen'
						},
						required: false
					},
					{
						name: 'user-avatar',
						type: ApplicationCommandOptionType.User,
						description: 'The user you want to get the image from',
						description_localizations: {
							'es-ES': 'El usuario de quien quieres la imagen'
						},
						required: false
					},
					{
						name: 'attachment',
						type: ApplicationCommandOptionType.Attachment,
						description: 'Use this if you want to apply the effect to the uploaded file',
						description_localizations: {
							'es-ES': 'Usa esto si quieres aplicar el efecto a un archivo'
						},
						required: false
					}
				]
			},
			{
				name: 'sepia',
				description: 'Change the image colors to sepia',
				description_localizations: {
					'es-ES': 'Cambia los colores de una imagen a sepia'
				},
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'image',
						type: ApplicationCommandOptionType.String,
						description: 'The URL of the image',
						description_localizations: {
							'es-ES': 'La URL de la imagen'
						},
						required: false
					},
					{
						name: 'user-avatar',
						type: ApplicationCommandOptionType.User,
						description: 'The user you want to get the image from',
						description_localizations: {
							'es-ES': 'El usuario de quien quieres la imagen'
						},
						required: false
					},
					{
						name: 'attachment',
						type: ApplicationCommandOptionType.Attachment,
						description: 'Use this if you want to apply the effect to the uploaded file',
						description_localizations: {
							'es-ES': 'Usa esto si quieres aplicar el efecto a un archivo'
						},
						required: false
					}
				]
			}
		]
	},
	{
		name: 'edit',
		description: 'Edit your profile settings',
		description_localizations: {
			'es-ES': 'Edita tus ajustes de perfil'
		},
		options: [
			{
				name: 'profile-image',
				description: 'Set your profile image (use /help profile-image to see every availabe image)',
				description_localizations: {
					'es-ES': 'Establece tu imagen de perfil (usa /help profile-image para ver las imágenes)'
				},
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'image',
						type: ApplicationCommandOptionType.String,
						description: 'The ID of the image',
						description_localizations: {
							'es-ES': 'La ID de la imagen'
						},
						required: true,
						choices: [
							{
								name: '1',
								value: 'pione'
							},
							{
								name: '2',
								value: 'pitwo'
							},
							{
								name: '3',
								value: 'pithree'
							},
							{
								name: '4',
								value: 'pifour'
							},
							{
								name: '5',
								value: 'pifive'
							},
							{
								name: '6',
								value: 'pisix'
							},
							{
								name: '7',
								value: 'piseven'
							},
							{
								name: '8',
								value: 'pieight'
							},
							{
								name: '9',
								value: 'pinine'
							},
							{
								name: '10',
								value: 'piten'
							},
							{
								name: '11',
								value: 'pieleven'
							}
						]
					}
				]
			},
			{
				name: 'profile-description',
				description: 'Set your profile description',
				description_localizations: {
					'es-ES': 'Establece la descripción de tu perfil'
				},
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'description',
						type: ApplicationCommandOptionType.String,
						description: 'Your new description',
						description_localizations: {
							'es-ES': 'Tu nueva descripción'
						},
						required: true
					}
				]
			},
			{
				name: 'profile-text',
				description: 'Set your profile text',
				description_localizations: {
					'es-ES': 'Establece tu texto de perfil'
				},
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'text',
						type: ApplicationCommandOptionType.String,
						description: 'Your new text',
						description_localizations: {
							'es-ES': 'Tu nuevo texto'
						},
						required: true
					}
				]
			},
			{
				name: 'rank-image',
				description: 'Set your rank image (use /help rank-image to see every availabe image)',
				description_localizations: {
					'es-ES': 'Establece tu imagen de rango (usa /help rank-image para ver las imágenes)'
				},
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'image',
						type: ApplicationCommandOptionType.String,
						description: 'The ID of the image',
						description_localizations: {
							'es-ES': 'La ID de la imagen'
						},
						required: true,
						choices: [
							{
								name: '1',
								value: 'rione'
							},
							{
								name: '2',
								value: 'ritwo'
							},
							{
								name: '3',
								value: 'rithree'
							},
							{
								name: '4',
								value: 'rifour'
							},
							{
								name: '5',
								value: 'rifive'
							}
						]
					}
				]
			}
		]
	},
	{
		name: 'generate',
		description: 'Generate a song using Suno',
		description_localizations: {
			'es-ES': 'Genera una canción usando Suno'
		},
		options: [
			{
				name: 'prompt',
				type: ApplicationCommandOptionType.String,
				description: 'Prompt that describes what you want to generate',
				description_localizations: {
					'es-ES': 'Prompt que describe lo que quieres generar'
				},
				required: true
			}
		]
	},
	{
		name: 'playlist',
		description: 'Add, remove or view the songs in the current queue',
		description_localizations: {
			'es-ES': 'Añade, borra o mira las canciones en la cola actual'
		},
		options: [
			{
				name: 'play',
				description: 'Add a song to the queue',
				description_localizations: {
					'es-ES': 'Añade una canción a la cola'
				},
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'song',
						type: ApplicationCommandOptionType.String,
						description: 'The song you want to add (set to "file" if you want to play a file)',
						description_localizations: {
							'es-ES': 'La canción a añadir (pon "file" si quieres poner un archivo)'
						},
						required: true
					},
					{
						name: 'file',
						type: ApplicationCommandOptionType.Attachment,
						description: 'The file (mp3, mp4, wav or ogg) you want to play (set song to "file")',
						description_localizations: {
							'es-ES': 'El archivo que quieres poner (mp3, mp4, wav o ogg) (pon "file" como song)'
						},
						required: false
					},
					{
						name: 'confirm-result',
						type: ApplicationCommandOptionType.Boolean,
						description: 'Whether or not to let you choose between found results',
						description_localizations: {
							'es-ES': 'Si quieres escoger entre los resultados encontrados'
						},
						required: false
					}
				]
			},
			{
				name: 'remove',
				description: 'Remove a song from the queue',
				description_localizations: {
					'es-ES': 'Borra una canción de la cola'
				},
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'id',
						type: ApplicationCommandOptionType.String,
						description: 'ID (number) of the song to remove',
						description_localizations: {
							'es-ES': 'ID (número) de la canción a quitar'
						},
						required: true
					},
					{
						name: 'slice',
						type: ApplicationCommandOptionType.Boolean,
						description: 'Whether to remove all songs queued after this one or not.',
						description_localizations: {
							'es-ES': 'Si quieres borrar todas las canciones a partir de esa o no'
						},
						required: false
					}
				]
			},
			{
				name: 'move',
				description: 'Move a song from the queue to another position',
				description_localizations: {
					'es-ES': 'Mueve una canción a otra posición'
				},
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'current',
						type: ApplicationCommandOptionType.String,
						description: 'The current position of the song',
						description_localizations: {
							'es-ES': 'La posición actual de la canción'
						},
						required: true
					},
					{
						name: 'new',
						type: ApplicationCommandOptionType.String,
						description: 'The new position of the song',
						description_localizations: {
							'es-ES': 'La nueva posición de la canción'
						},
						required: true
					}
				]
			},
			{
				name: 'view',
				description: 'View the queue',
				description_localizations: {
					'es-ES': 'Mira la cola'
				},
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'page',
						type: ApplicationCommandOptionType.String,
						description: 'The page of the queue you want to view',
						description_localizations: {
							'es-ES': 'La página de la cola que quieres ver'
						},
						required: false
					}
				]
			},
			{
				name: 'skip',
				description: 'Vote to skip to the next song in queue',
				description_localizations: {
					'es-ES': 'Vota para saltar a la próxima canción'
				},
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'to',
						type: ApplicationCommandOptionType.String,
						description: 'The song you want to skip to',
						description_localizations: {
							'es-ES': 'La canción a la que quieres saltar'
						},
						required: false
					}
				]
			},
			{
				name: 'forceskip',
				description: 'Skip to the next song in queue (permission needed)',
				description_localizations: {
					'es-ES': 'Salta a la próxima canción (permisos necesarios)'
				},
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'to',
						type: ApplicationCommandOptionType.String,
						description: 'The song you want to skip to',
						description_localizations: {
							'es-ES': 'La canción a la que quieres saltar'
						},
						required: false
					}
				]
			},
			{
				name: 'stop',
				description: 'Make the bot leave and delete all the queue',
				description_localizations: {
					'es-ES': 'Haz que el bot salga y borre toda la cola'
				},
				type: ApplicationCommandOptionType.Subcommand
			},
			{
				name: 'volume',
				description: 'Change or view the current volume (default: 1)',
				description_localizations: {
					'es-ES': 'Cambia o mira el volumen (por defecto es 1)'
				},
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'value',
						type: ApplicationCommandOptionType.String,
						description: 'The new volume',
						description_localizations: {
							'es-ES': 'El nuevo volumen'
						},
						required: false
					}
				]
			},
			{
				name: 'current-song',
				description: 'View or modify the current song',
				description_localizations: {
					'es-ES': 'Mira o modifica la canción actual'
				},
				type: ApplicationCommandOptionType.SubcommandGroup,
				options: [
					{
						name: 'view',
						type: ApplicationCommandOptionType.Subcommand,
						description: 'View the currently playing song',
						description_localizations: {
							'es-ES': 'Mira la canción sonando actualmente'
						}
					},
					{
						name: 'pause',
						type: ApplicationCommandOptionType.Subcommand,
						description: 'Pause the currently playing song',
						description_localizations: {
							'es-ES': 'Pausa la canción sonando actualmente'
						}
					},
					{
						name: 'resume',
						type: ApplicationCommandOptionType.Subcommand,
						description: 'Unpause the currently playing song',
						description_localizations: {
							'es-ES': 'Despausa la canción sonando actualmente'
						}
					},
					{
						name: 'seek',
						type: ApplicationCommandOptionType.Subcommand,
						description: 'Jump to a specified part of the currently playing song',
						description_localizations: {
							'es-ES': 'Salta a una parte específica de la canción'
						},
						options: [
							{
								name: 'timestamp',
								type: ApplicationCommandOptionType.String,
								description: 'Part of the song where you want to jump to (MM:SS)',
								description_localizations: {
									'es-ES': 'Parte de la canción a la que quieres saltar (MM:SS)'
								},
								required: true
							}
						]
					}
				]
			},
			{
				name: 'loop',
				description: 'Loop the whole queue',
				type: ApplicationCommandOptionType.Subcommand,
				description_localizations: {
					'es-ES': 'Pon la cola en bucle'
				}
			},
			{
				name: 'shuffle',
				description: 'Shuffle mode (random)',
				type: ApplicationCommandOptionType.Subcommand,
				description_localizations: {
					'es-ES': 'Pon la cola en modo aleatorio'
				}
			},
			{
				name: 'autoplay',
				description: 'Automatically play songs when there is nothing left on the queue',
				type: ApplicationCommandOptionType.Subcommand,
				description_localizations: {
					'es-ES': 'Poner canciones automáticamente cuando ya no queden'
				}
			}
		]
	},
	{
		name: 'about',
		description: 'Get info about the bot',
		description_localizations: {
			'es-ES': 'Obtén información acerca del bot'
		}
	},
	{
		name: 'profile',
		description: 'Get your profile card',
		description_localizations: {
			'es-ES': 'Obtén tu tarjeta de perfil'
		},
		options: [
			{
				name: 'user',
				type: ApplicationCommandOptionType.User,
				description: 'The user whose profile card you want to see',
				description_localizations: {
					'es-ES': 'El usuario cuya tarjeta de perfil quieres ver'
				},
				required: false
			}
		]
	},
	{
		name: 'rank',
		description: 'Get your rank card',
		description_localizations: {
			'es-ES': 'Obtén tu tarjeta de rango'
		},
		options: [
			{
				name: 'user',
				type: ApplicationCommandOptionType.User,
				description: 'The user whose rank card you want to see',
				description_localizations: {
					'es-ES': 'El usuario cuya tarjeta de rango deseas ver'
				},
				required: false
			}
		]
	},
	{
		name: 'rep',
		description: 'Give a reputation point to someone',
		description_localizations: {
			'es-ES': 'Dale un punto de reputación a alguien'
		},
		options: [
			{
				name: 'user',
				type: ApplicationCommandOptionType.User,
				description: 'The user to whom you want to give a reputation point',
				description_localizations: {
					'es-ES': 'El usuario al que quieres dar el punto de reputación'
				},
				required: true
			}
		]
	},
	{
		name: 'top',
		description: 'Get the activity leaderboard',
		description_localizations: {
			'es-ES': 'Obtén la tabla de clasificación de actividad'
		},
		options: [
			{
				name: 'global',
				description: 'Whether or not to get the global top',
				description_localizations: {
					'es-ES': 'Si quieres o no la tabla global'
				},
				type: ApplicationCommandOptionType.Boolean,
				required: false
			}
		]
	},
	{
		name: 'today-in-history',
		description: 'Get information about today in history',
		description_localizations: {
			'es-ES': 'Obtén información acerca de hoy en la historia'
		}
	},
	{
		name: 'feedback',
		description: 'Send some feedback about the bot to the developer',
		description_localizations: {
			'es-ES': 'Manda un comentario de retroalimentación acerca del bot al desarrollador'
		}
	},
	{
		name: 'binary',
		description: 'Encode or decode binary',
		description_localizations: {
			'es-ES': 'Codifica o decodifica binario'
		},
		options: [
			{
				name: 'action',
				type: ApplicationCommandOptionType.String,
				description: 'The action you want to perform',
				description_localizations: {
					'es-ES': 'La acción que quieres realizar'
				},
				required: true,
				choices: [
					{
						name: 'Encode',
						name_localizations: { 'es-ES': 'Codificar' },
						value: 'encode_binary'
					},
					{
						name: 'Decode',
						name_localizations: { 'es-ES': 'Decodificar' },
						value: 'decode_binary'
					}
				]
			},
			{
				name: 'text',
				type: ApplicationCommandOptionType.String,
				description: 'The text to encode or decode',
				description_localizations: {
					'es-ES': 'El texto a codificar/decodificar'
				},
				required: true
			}
		]
	},
	{
		name: 'tts',
		description: 'Play a TTS message in your voice channel',
		description_localizations: {
			'es-ES': 'Haz sonar un mensaje en tu canal de voz'
		},
		options: [
			{
				name: 'text',
				type: ApplicationCommandOptionType.String,
				description: 'The text you want to play',
				description_localizations: {
					'es-ES': 'El texto que quieres hacer sonar'
				},
				required: true
			},
			{
				name: 'language',
				type: ApplicationCommandOptionType.String,
				description: "The language of the narrator (es-ES, en-GB...) (guild's if not set)",
				description_localizations: {
					'es-ES': 'El idioma del narrador (es-ES, en-GB...) (el del servidor por defecto)'
				},
				required: false
			}
		]
	},
	{
		name: 'fakeyou',
		description: 'Play a TTS message with a voice from FakeYou',
		description_localizations: {
			'es-ES': 'Haz sonar un mensaje en tu canal de voz con una voz de FakeYou'
		},
		options: [
			{
				name: 'voice',
				type: ApplicationCommandOptionType.String,
				description: 'The name of the person that you want to fake',
				description_localizations: {
					'es-ES': 'El nombre de la persona a la que quieres imitar'
				},
				required: true
			},
			{
				name: 'text',
				type: ApplicationCommandOptionType.String,
				description: 'The text you want to play',
				description_localizations: {
					'es-ES': 'El texto que quieres hacer sonar'
				},
				required: true
			}
		]
	},
	{
		name: 'calculate',
		description: 'Calculate the given expression',
		description_localizations: {
			'es-ES': 'Calcula la expresión dada'
		},
		options: [
			{
				name: 'expression',
				type: ApplicationCommandOptionType.String,
				description: 'The expression you want to calculate',
				description_localizations: {
					'es-ES': 'La expresión que quieres calcular'
				},
				required: true
			}
		]
	},
	{
		name: 'embed',
		description: 'Build an embed',
		description_localizations: {
			'es-ES': 'Construye un embed'
		},
		options: [
			{
				name: 'json',
				type: ApplicationCommandOptionType.String,
				description: 'OPTIONAL: The JSON code of the embed',
				description_localizations: {
					'es-ES': 'OPCIONAL: El código JSON del embed'
				},
				required: false
			},
			{
				name: 'title',
				type: ApplicationCommandOptionType.String,
				description: 'The title of the embed',
				description_localizations: {
					'es-ES': 'El título del embed'
				},
				required: false
			},
			{
				name: 'description',
				type: ApplicationCommandOptionType.String,
				description: 'The description of the embed',
				description_localizations: {
					'es-ES': 'La descripción del embed'
				},
				required: false
			},
			{
				name: 'footer',
				type: ApplicationCommandOptionType.String,
				description: 'The footer of the embed',
				description_localizations: {
					'es-ES': 'El pie de página del embed'
				},
				required: false
			},
			{
				name: 'thumbnail',
				type: ApplicationCommandOptionType.String,
				description: 'The thumbnail of the embed',
				description_localizations: {
					'es-ES': 'La miniatura del embed'
				},
				required: false
			},
			{
				name: 'image',
				type: ApplicationCommandOptionType.String,
				description: 'The image of the embed',
				description_localizations: {
					'es-ES': 'La imagen del embed'
				},
				required: false
			},
			{
				name: 'color',
				type: ApplicationCommandOptionType.String,
				description: 'The color of the embed',
				description_localizations: {
					'es-ES': 'El color del embed'
				},
				required: false
			}
		]
	},
	{
		name: 'jumbo',
		description: 'Get the image (PNG) of an emoji',
		description_localizations: {
			'es-ES': 'Obtén la imagen (PNG) de un emoji'
		},
		options: [
			{
				name: 'emoji',
				description: 'The emoji you want to get the image from',
				description_localizations: {
					'es-ES': 'El emoji del que quieres obtener la imagen'
				},
				type: ApplicationCommandOptionType.String,
				required: true
			}
		]
	},
	{
		name: 'ping',
		description: 'Pong!',
		options: [
			{
				name: 'advanced',
				description: 'Whether or not to get advanced ping info',
				description_localizations: {
					'es-ES': 'Si debería mostrar información avanzada o no'
				},
				type: ApplicationCommandOptionType.Boolean,
				required: false
			}
		]
	},
	{
		name: 'remind',
		description: 'View or add a reminder',
		description_localizations: {
			'es-ES': 'Mira o añade un recordatorio'
		},
		options: [
			{
				name: 'list',
				description: 'View your reminder list',
				description_localizations: {
					'es-ES': 'Ve tu lista de recordatorios'
				},
				type: ApplicationCommandOptionType.Subcommand
			},
			{
				name: 'new',
				description: 'Set a new reminder',
				description_localizations: {
					'es-ES': 'Establece un nuevo recordatorio'
				},
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'reminder',
						type: ApplicationCommandOptionType.String,
						description: 'What do you want me to remind you?',
						description_localizations: {
							'es-ES': '¿Qué quieres que te recuerde?'
						},
						required: true
					},
					{
						name: 'time',
						type: ApplicationCommandOptionType.String,
						description: 'When do you want me to remind you? (1d, 30m, 2mo...)',
						description_localizations: {
							'es-ES': '¿Cuándo quieres que te lo recuerde? (1d, 30m, 1mo...)'
						},
						required: true
					}
				]
			}
		]
	},
	{
		name: 'sauce',
		description: 'Get the source of an image',
		description_localizations: {
			'es-ES': 'Obtén la fuente de una imagen'
		},
		options: [
			{
				name: 'image',
				type: ApplicationCommandOptionType.String,
				description: 'The URL of the image',
				description_localizations: {
					'es-ES': 'La URL de la imagen'
				},
				required: false
			},
			{
				name: 'user-avatar',
				type: ApplicationCommandOptionType.User,
				description: 'The user you want to get the image from',
				description_localizations: {
					'es-ES': 'El usuario de quien quieres la imagen'
				},
				required: false
			},
			{
				name: 'attachment',
				type: ApplicationCommandOptionType.Attachment,
				description: 'Use this if you want to select the uploaded file',
				description_localizations: {
					'es-ES': 'Usa esto si quieres seleccionar un archivo'
				},
				required: false
			}
		]
	},
	{
		name: 'convert',
		description: 'Convert units to other units',
		description_localizations: {
			'es-ES': 'Convierte unidades a otras unidades'
		},
		options: [
			{
				name: 'amount',
				type: ApplicationCommandOptionType.String,
				description: 'The amount of base unit you want to convert (1, 10...)',
				description_localizations: {
					'es-ES': 'La cantidad de la unidad base que quieres convertir (1, 10...)'
				},
				required: true
			},
			{
				name: 'base-unit',
				type: ApplicationCommandOptionType.String,
				description: 'The base unit (p.e, cm)',
				description_localizations: {
					'es-ES': 'La unidad base (p.e, cm)'
				},
				required: true
			},
			{
				name: 'target-unit',
				type: ApplicationCommandOptionType.String,
				description: 'The target unit (p.e, m)',
				description_localizations: {
					'es-ES': 'La unidad a la que quieres convertir (p.e, m)'
				},
				required: true
			}
		]
	},
	{
		name: 'time-zone',
		description: 'Get the current time of the zone you want',
		description_localizations: {
			'es-ES': 'Obtén la hora de la zona especificada'
		},
		options: [
			{
				name: 'zone',
				type: ApplicationCommandOptionType.String,
				description: 'Country, city... to get the time from',
				description_localizations: {
					'es-ES': 'País, ciudad... del que obtener la hora'
				},
				required: true
			}
		]
	},
	{
		name: 'translate',
		description: 'Translate text to other languages',
		description_localizations: {
			'es-ES': 'Traduce texto a otros idiomas'
		},
		options: [
			{
				name: 'to',
				type: ApplicationCommandOptionType.String,
				description: 'Language to translate (en, es...)',
				description_localizations: {
					'es-ES': 'Idioma al que traducir (en, es...)'
				},
				required: true
			},
			{
				name: 'text',
				type: ApplicationCommandOptionType.String,
				description: 'The text to translate',
				description_localizations: {
					'es-ES': 'El texto que traducir'
				},
				required: true
			}
		]
	},
	{
		name: 'setlevel',
		description: "Set someone's level (only admin)",
		description_localizations: {
			'es-ES': 'Establece el nivel de alguien (solo admin)'
		},
		options: [
			{
				name: 'user',
				type: ApplicationCommandOptionType.User,
				description: 'The user',
				description_localizations: {
					'es-ES': 'El usuario'
				},
				required: true
			},
			{
				name: 'level',
				type: ApplicationCommandOptionType.String,
				description: 'The new level of the user',
				description_localizations: {
					'es-ES': 'El nuevo nivel del usuario'
				},
				required: true
			}
		]
	},
	{
		name: 'leveledroles',
		description: 'Add, remove or view the leveled roles in the server',
		description_localizations: {
			'es-ES': 'Añade, borra o mira los roles de niveles del servidor'
		},
		options: [
			{
				name: 'add',
				description: 'Add a leveled role',
				description_localizations: {
					'es-ES': 'Añade un rol por nivel'
				},
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'role',
						type: ApplicationCommandOptionType.Role,
						description: 'The role you want to add',
						description_localizations: {
							'es-ES': 'El rol que quieres añadir'
						},
						required: true
					},
					{
						name: 'level',
						type: ApplicationCommandOptionType.String,
						description: 'The level at which you want to give the role',
						description_localizations: {
							'es-ES': 'El nivel al que dar el rol'
						},
						required: true
					}
				]
			},
			{
				name: 'remove',
				description: 'Remove a leveled role',
				description_localizations: {
					'es-ES': 'Borra un rol por nivel'
				},
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'role',
						type: ApplicationCommandOptionType.Role,
						description: 'The role you want to remove from the list',
						description_localizations: {
							'es-ES': 'El rol que quieres remover de la lista'
						},
						required: true
					},
					{
						name: 'level',
						type: ApplicationCommandOptionType.String,
						description: 'The level at which the role is given',
						description_localizations: {
							'es-ES': 'El nivel en el que se da el rol'
						},
						required: true
					}
				]
			},
			{
				name: 'view',
				description: 'View the leveled roles list',
				description_localizations: {
					'es-ES': 'Mira la lista de roles de niveles'
				},
				type: ApplicationCommandOptionType.Subcommand
			}
		]
	},
	{
		name: 'youtube-together',
		description: 'Watch YouTube with friends (only desktop currently)',
		description_localizations: {
			'es-ES': 'Mira YouTube con amigos (solo en PC por ahora)'
		}
	},
	{
		name: 'avatar',
		description: "Get some user's avatar",
		description_localizations: {
			'es-ES': 'Obtén el avatar de algún usuario'
		},
		options: [
			{
				name: 'user',
				type: ApplicationCommandOptionType.User,
				description: 'The user you want to get the avatar from',
				description_localizations: {
					'es-ES': 'El usuario de quien quieres el avatar'
				},
				required: false
			}
		]
	},
	{
		name: 'info',
		description: "Get some user's profile information",
		description_localizations: {
			'es-ES': 'Obtén información de un usuario'
		},
		options: [
			{
				name: 'user',
				type: ApplicationCommandOptionType.User,
				description: 'The user you want to get information from',
				description_localizations: {
					'es-ES': 'El usuario sobre el que quieres información'
				},
				required: false
			}
		]
	},
	{
		name: 'server',
		description: 'Get the server information',
		description_localizations: {
			'es-ES': 'Obtén información sobre el servidor'
		}
	},
	{
		name: 'help',
		description: 'Get help about something related to the bot',
		description_localizations: {
			'es-ES': 'Obtén ayuda sobre algo relacionado con el bot'
		},
		options: [
			{
				name: 'command',
				type: ApplicationCommandOptionType.String,
				description: 'The command with which you need help',
				description_localizations: {
					'es-ES': 'El comando con el que necesitas ayuda'
				},
				required: false
			}
		]
	},
	{
		name: 'invite',
		description: 'Invite the bot to your server',
		description_localizations: {
			'es-ES': 'Invita el bot a tu servidor'
		}
	},
	{
		name: 'bot-info',
		description: 'Get info about the bot',
		description_localizations: {
			'es-ES': 'Obtén información acerca del bot'
		}
	},
	// {
	// 	name: 'world',
	// 	description: 'Get info about the world'
	// },
	{
		name: 'cuddle',
		description: 'Cuddle with someone',
		description_localizations: {
			'es-ES': 'Acurrúcate con alguien'
		},
		options: [
			{
				name: 'user',
				type: ApplicationCommandOptionType.User,
				description: 'The user you want to cuddle with',
				description_localizations: {
					'es-ES': 'El usuario con quien te quieres acurrucar'
				},
				required: false
			}
		]
	},
	{
		name: 'hug',
		description: 'Hug someone',
		description_localizations: {
			'es-ES': 'Da un abrazo a alguien'
		},
		options: [
			{
				name: 'user',
				type: ApplicationCommandOptionType.User,
				description: 'The user you want to hug',
				description_localizations: {
					'es-ES': 'El usuario a quien quieres abrazar'
				},
				required: false
			}
		]
	},
	{
		name: 'kiss',
		description: 'Kiss someone',
		description_localizations: {
			'es-ES': 'Besa a alguien'
		},
		options: [
			{
				name: 'user',
				type: ApplicationCommandOptionType.User,
				description: 'The user you want to kiss',
				description_localizations: {
					'es-ES': 'El usuario a quien quieres besar'
				},
				required: false
			}
		]
	},
	{
		name: 'pat',
		description: 'Pat someone',
		description_localizations: {
			'es-ES': 'Acaricia a alguien'
		},
		options: [
			{
				name: 'user',
				type: ApplicationCommandOptionType.User,
				description: 'The user you want to pat',
				description_localizations: {
					'es-ES': 'El usuario a quien quieres acariciar'
				},
				required: false
			}
		]
	},
	// {
	// 	name: 'poke',
	// 	description: 'Poke someone',
	// 	description_localizations: {
	// 		'es-ES': 'Molesta un poco a alguien'
	// 	},
	// 	options: [
	// 		{
	// 			name: 'user',
	// 			type: ApplicationCommandOptionType.User,
	// 			description: 'The user you want to poke',
	// 			description_localizations: {
	// 				'es-ES': 'El usuario a quien quieres molestar'
	// 			},
	// 			required: false
	// 		}
	// 	]
	// },
	{
		name: 'slap',
		description: "Slap someone's face",
		description_localizations: {
			'es-ES': 'Dale un tortazo a alguien'
		},
		options: [
			{
				name: 'user',
				type: ApplicationCommandOptionType.User,
				description: 'The user you want to faceslap',
				description_localizations: {
					'es-ES': 'El usuario a quien quieres dar un tortazo'
				},
				required: false
			}
		]
	},
	{
		name: 'ban',
		description: 'Permanently ban someone',
		description_localizations: {
			'es-ES': 'Banea a alguien permanentemente'
		},
		options: [
			{
				name: 'user',
				type: ApplicationCommandOptionType.User,
				description: 'The user you want to ban',
				description_localizations: {
					'es-ES': 'El usuario que quieres banear'
				},
				required: true
			},
			{
				name: 'reason',
				type: ApplicationCommandOptionType.String,
				description: 'The reason for your ban',
				description_localizations: {
					'es-ES': 'La razón de tu ban'
				},
				required: true
			},
			{
				name: 'notify',
				type: ApplicationCommandOptionType.Boolean,
				description: 'Whether or not to notify the user',
				description_localizations: {
					'es-ES': 'Si debería notificar o no al usuario'
				},
				required: false
			}
		]
	},
	{
		name: 'kick',
		description: 'Kick someone of the server',
		description_localizations: {
			'es-ES': 'Expulsa a alguien del servidor'
		},
		options: [
			{
				name: 'user',
				type: ApplicationCommandOptionType.User,
				description: 'The user you want to kick',
				description_localizations: {
					'es-ES': 'El usuario a quien quieres expulsar'
				},
				required: true
			},
			{
				name: 'reason',
				type: ApplicationCommandOptionType.String,
				description: 'The reason for your kick',
				description_localizations: {
					'es-ES': 'La razón de la expulsión'
				},
				required: true
			},
			{
				name: 'notify',
				type: ApplicationCommandOptionType.Boolean,
				description: 'Whether or not to notify the user',
				description_localizations: {
					'es-ES': 'Si debería notificar o no al usuario'
				},
				required: false
			}
		]
	},
	{
		name: 'warn',
		description: 'Warn someone',
		description_localizations: {
			'es-ES': 'Da una advertencia a alguien'
		},
		options: [
			{
				name: 'user',
				type: ApplicationCommandOptionType.User,
				description: 'The user you want to warn',
				description_localizations: {
					'es-ES': 'El usuario a quien quieres advertir'
				},
				required: true
			},
			{
				name: 'reason',
				type: ApplicationCommandOptionType.String,
				description: 'The reason for your warn',
				description_localizations: {
					'es-ES': 'La razón de tu advertencia'
				},
				required: true
			},
			{
				name: 'notify',
				type: ApplicationCommandOptionType.Boolean,
				description: 'Whether or not to notify the user',
				description_localizations: {
					'es-ES': 'Si debería notificar o no al usuario'
				},
				required: false
			}
		]
	},
	{
		name: 'timeout',
		description: 'Times some member out (0 to clear the timeout)',
		description_localizations: {
			'es-ES': 'Aísla a un miembro temporalmente (0 para quitar el aislamiento)'
		},
		options: [
			{
				name: 'user',
				type: ApplicationCommandOptionType.User,
				description: 'The user you want to time out',
				description_localizations: {
					'es-ES': 'El usuario a quien quieres aislar'
				},
				required: true
			},
			{
				name: 'duration',
				type: ApplicationCommandOptionType.String,
				description: 'The duration of the time out, for example 1h (0 to clear the timeout)',
				description_localizations: {
					'es-ES': 'La duración del aislamiento, p.e 1h (0 para quitar el aislamiento)'
				},
				required: true
			},
			{
				name: 'reason',
				type: ApplicationCommandOptionType.String,
				description: 'The reason for your time out',
				description_localizations: {
					'es-ES': 'La razón del aislamiento'
				},
				required: false
			}
		]
	},
	{
		name: 'tempban',
		description: 'Temporaly ban someone',
		options: [
			{
				name: 'user',
				type: ApplicationCommandOptionType.User,
				description: 'The user you want to ban',
				description_localizations: {
					'es-ES': 'El usuario a quien quieres banear'
				},
				required: true
			},
			{
				name: 'reason',
				type: ApplicationCommandOptionType.String,
				description: 'The reason for your ban',
				description_localizations: {
					'es-ES': 'La razón del ban'
				},
				required: true
			},
			{
				name: 'duration',
				type: ApplicationCommandOptionType.String,
				description: 'The duration of the ban (1d, 5h...)',
				description_localizations: {
					'es-ES': 'La duración del ban (1d, 5h...)'
				},
				required: true
			},
			{
				name: 'notify',
				type: ApplicationCommandOptionType.Boolean,
				description: 'Whether or not to notify the user',
				description_localizations: {
					'es-ES': 'Si debería o no notificar al usuario'
				},
				required: false
			}
		]
	},
	{
		name: 'mute',
		description: 'Mute someone',
		description_localizations: {
			'es-ES': 'Silencia a alguien'
		},
		options: [
			{
				name: 'user',
				type: ApplicationCommandOptionType.User,
				description: 'The user you want to mute',
				description_localizations: {
					'es-ES': 'El usuario que quieres silenciar'
				},
				required: true
			},
			{
				name: 'reason',
				type: ApplicationCommandOptionType.String,
				description: 'The reason for your mute',
				description_localizations: {
					'es-ES': 'La razón del silenciamiento'
				},
				required: true
			},
			{
				name: 'duration',
				type: ApplicationCommandOptionType.String,
				description: 'The duration of the mute (1d, 5h...)',
				description_localizations: {
					'es-ES': 'La duración del silenciamiento (1d, 5h...)'
				},
				required: false
			},
			{
				name: 'notify',
				type: ApplicationCommandOptionType.Boolean,
				description: 'Whether or not to notify the user',
				description_localizations: {
					'es-ES': 'Si debería o no notificar al usuario'
				},
				required: false
			}
		]
	},
	{
		name: 'unmute',
		description: 'Unmute someone already muted',
		description_localizations: {
			'es-ES': 'Desmutea a alguien previamente silenciado'
		},
		options: [
			{
				name: 'user',
				type: ApplicationCommandOptionType.User,
				description: 'The user you want to unmute',
				description_localizations: {
					'es-ES': 'El usuario que quieres desmutear'
				},
				required: true
			},
			{
				name: 'reason',
				type: ApplicationCommandOptionType.String,
				description: 'The reason for your unmute',
				description_localizations: {
					'es-ES': 'La razón del desmuteo'
				},
				required: false
			}
		]
	},
	{
		name: 'forceban',
		description: 'Permanently ban someone that is not in the server',
		description_localizations: {
			'es-ES': 'Banea permanentemente a alguien que no está en el servidor'
		},
		options: [
			{
				name: 'user',
				type: ApplicationCommandOptionType.String,
				description: 'The id of the user you want to ban',
				description_localizations: {
					'es-ES': 'La ID del usuario que quieres banear'
				},
				required: true
			},
			{
				name: 'reason',
				type: ApplicationCommandOptionType.String,
				description: 'The reason for your ban',
				description_localizations: {
					'es-ES': 'La razón de tu ban'
				},
				required: true
			}
		]
	},
	{
		name: 'role',
		description: 'Add or remove a role to a user',
		description_localizations: {
			'es-ES': 'Añade o quita un rol a un usuario'
		},
		options: [
			{
				name: 'add',
				description: 'Add a role',
				description_localizations: {
					'es-ES': 'Añade un rol a un usuario'
				},
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'user',
						type: ApplicationCommandOptionType.User,
						description: 'The user you want to give the role',
						description_localizations: {
							'es-ES': 'El usuario al que quieres dar el rol'
						},
						required: true
					},
					{
						name: 'role',
						type: ApplicationCommandOptionType.Role,
						description: 'The role you want to add',
						description_localizations: {
							'es-ES': 'El rol que quieres añadir'
						},
						required: true
					}
				]
			},
			{
				name: 'remove',
				description: 'Remove a role',
				description_localizations: {
					'es-ES': 'Quita un rol a un usuario'
				},
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'user',
						type: ApplicationCommandOptionType.User,
						description: 'The user you want to remove the role',
						description_localizations: {
							'es-ES': 'El usuario al que quieres quitar el rol'
						},
						required: true
					},
					{
						name: 'role',
						type: ApplicationCommandOptionType.Role,
						description: 'The role you want to remove',
						description_localizations: {
							'es-ES': 'El rol que quieres quitar'
						},
						required: true
					}
				]
			}
		]
	},
	{
		name: 'mban',
		description: 'Ban multiple users permanently with one command',
		description_localizations: {
			'es-ES': 'Banea a múltiples usuarios con un comando'
		},
		options: [
			{
				name: 'users',
				type: ApplicationCommandOptionType.String,
				description: 'The ID of the users you want to ban separated by a space',
				description_localizations: {
					'es-ES': 'Las ID de los usuarios que quieres banear separadas por un espacio'
				},
				required: true
			},
			{
				name: 'reason',
				type: ApplicationCommandOptionType.String,
				description: 'The reason for your ban',
				description_localizations: {
					'es-ES': 'La razón del ban'
				},
				required: true
			}
		]
	},
	{
		name: 'mkick',
		description: 'Kick multiple users with one command',
		description_localizations: {
			'es-ES': 'Expulsa a múltiples usuarios con un comando'
		},
		options: [
			{
				name: 'users',
				type: ApplicationCommandOptionType.String,
				description: 'The ID of the users you want to kick separated by a space',
				description_localizations: {
					'es-ES': 'Las ID de los usuarios que quieres expulsar separadas por un espacio'
				},
				required: true
			},
			{
				name: 'reason',
				type: ApplicationCommandOptionType.String,
				description: 'The reason for your kick',
				description_localizations: {
					'es-ES': 'La razón de la expulsión'
				},
				required: true
			}
		]
	},
	{
		name: 'lock',
		description: 'Lock the current channel',
		description_localizations: {
			'es-ES': 'Bloquea el canal actual'
		},
		options: [
			{
				name: 'role',
				type: ApplicationCommandOptionType.Role,
				description: 'The role you want to be locked (leave in blank if @everyone)',
				description_localizations: {
					'es-ES': 'El rol que quieres bloquear (@everyone por defecto)'
				},
				required: false
			}
		]
	},
	{
		name: 'unlock',
		description: 'unlock the current channel',
		description_localizations: {
			'es-ES': 'Desbloquea el canal actual'
		},
		options: [
			{
				name: 'role',
				type: ApplicationCommandOptionType.Role,
				description: 'The role you want to be unlocked (leave in blank if @everyone)',
				description_localizations: {
					'es-ES': 'El rol que quieres desbloquear (@everyone por defecto)'
				},
				required: false
			}
		]
	},
	{
		name: 'Translate',
		name_localizations: { 'es-ES': 'Traducir' },
		type: ApplicationCommandType.Message
	},
	{
		name: 'Get sauce',
		name_localizations: { 'es-ES': 'Obtener fuente' },
		type: ApplicationCommandType.Message
	},
	{
		name: 'Add to queue',
		name_localizations: { 'es-ES': 'Añadir a la cola' },
		type: ApplicationCommandType.Message
	},
	{
		name: 'Information',
		name_localizations: { 'es-ES': 'Información' },
		type: ApplicationCommandType.User
	},
	{
		name: 'Avatar',
		name_localizations: { 'es-ES': 'Avatar' },
		type: ApplicationCommandType.User
	},
	{
		name: 'Invite to YT Together',
		name_localizations: { 'es-ES': 'Invitar a YT Together' },
		type: ApplicationCommandType.User
	},
	{
		name: 'Play Connect 4',
		name_localizations: { 'es-ES': 'Jugar Conecta 4' },
		type: ApplicationCommandType.User
	},
	{
		name: 'Play Tic Tac Toe',
		name_localizations: { 'es-ES': 'Jugar Tres en Raya' },
		type: ApplicationCommandType.User
	}
];

export default commands;
