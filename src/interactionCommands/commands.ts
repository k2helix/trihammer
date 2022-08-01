import { ApplicationCommandOptionType, ApplicationCommandType } from 'discord.js';
export default [
	{
		name: 'set',
		description: 'Set some configuration',
		options: [
			{
				name: 'autorole',
				description: 'Set the autorole',
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'role',
						type: ApplicationCommandOptionType.Role,
						description: 'The new autorole',
						required: true
					}
				]
			},
			{
				name: 'admin-role',
				description: 'Set the admin role',
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'role',
						type: ApplicationCommandOptionType.Role,
						description: 'The new admin role',
						required: true
					}
				]
			},
			{
				name: 'mod-role',
				description: 'Set the moderator role',
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'role',
						type: ApplicationCommandOptionType.Role,
						description: 'The new moderator role',
						required: true
					}
				]
			},
			{
				name: 'prefix',
				description: 'Set the prefix',
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'prefix',
						type: ApplicationCommandOptionType.String,
						description: 'The new prefix',
						required: true
					}
				]
			},
			{
				name: 'language',
				description: "Set the language (does not affect slash commands' description)",
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'language',
						type: ApplicationCommandOptionType.String,
						description: 'The new language',
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
				type: ApplicationCommandOptionType.SubcommandGroup,
				options: [
					{
						name: 'channel',
						type: ApplicationCommandOptionType.Subcommand,
						description: 'The welcome channel',
						required: false,
						options: [
							{
								name: 'channel',
								type: ApplicationCommandOptionType.Channel,
								description: 'The new channel',
								required: true
							}
						]
					},
					{
						name: 'color',
						type: ApplicationCommandOptionType.Subcommand,
						description: 'The welcome title color',
						required: false,
						options: [
							{
								name: 'color',
								type: ApplicationCommandOptionType.String,
								description: 'The new color',
								required: true
							}
						]
					},
					{
						name: 'image',
						type: ApplicationCommandOptionType.Subcommand,
						description: 'The welcome background image',
						required: false,
						options: [
							{
								name: 'image',
								type: ApplicationCommandOptionType.String,
								description: 'The new image URL',
								required: false
							},
							{
								name: 'attachment',
								type: ApplicationCommandOptionType.Attachment,
								description: 'Use this if you want to select the uplaoded file',
								required: false
							}
						]
					},
					{
						name: 'message',
						type: ApplicationCommandOptionType.Subcommand,
						description: 'The welcome message',
						required: false,
						options: [
							{
								name: 'message',
								type: ApplicationCommandOptionType.String,
								description: 'The new message',
								required: true
							}
						]
					}
				]
			},
			{
				name: 'actions-logs',
				description: 'Set the actions logs channel',
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'channel',
						type: ApplicationCommandOptionType.Channel,
						description: 'The new channel',
						required: true
					}
				]
			},
			{
				name: 'infractions-logs',
				description: 'Set the infractions logs channel',
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'channel',
						type: ApplicationCommandOptionType.Channel,
						description: 'The new channel',
						required: true
					}
				]
			},
			{
				name: 'members-logs',
				description: 'Set the members logs channel',
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'channel',
						type: ApplicationCommandOptionType.Channel,
						description: 'The new channel',
						required: true
					}
				]
			},
			{
				name: 'messages-logs',
				description: 'Set the messages logs channel',
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'channel',
						type: ApplicationCommandOptionType.Channel,
						description: 'The new channel',
						required: true
					}
				]
			},
			{
				name: 'server-logs',
				description: 'Set the server logs channel',
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'channel',
						type: ApplicationCommandOptionType.Channel,
						description: 'The new channel',
						required: true
					}
				]
			},
			{
				name: 'voice-logs',
				description: 'Set the voice logs channel',
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'channel',
						type: ApplicationCommandOptionType.Channel,
						description: 'The new channel',
						required: true
					}
				]
			}
		]
	},
	{
		name: 'search',
		description: 'Search something',
		options: [
			{
				name: 'anime',
				description: 'Search for an anime',
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'query',
						type: ApplicationCommandOptionType.String,
						description: 'The anime to search',
						required: true
					},
					{
						name: 'confirm-result',
						type: ApplicationCommandOptionType.Boolean,
						description: 'Whether or not to let you choose between found results',
						required: false
					}
				]
			},
			{
				name: 'manga',
				description: 'Search for a manga',
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'query',
						type: ApplicationCommandOptionType.String,
						description: 'The manga to search',
						required: true
					},
					{
						name: 'confirm-result',
						type: ApplicationCommandOptionType.Boolean,
						description: 'Whether or not to let you choose between found results',
						required: false
					}
				]
			},
			{
				name: 'image',
				description: 'Search for an image ',
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'query',
						type: ApplicationCommandOptionType.String,
						description: 'The query for the image',
						required: true
					}
				]
			},
			{
				name: 'game',
				description: 'Search for a game',
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'query',
						type: ApplicationCommandOptionType.String,
						description: 'The game you want to search',
						required: true
					},
					{
						name: 'confirm-result',
						type: ApplicationCommandOptionType.Boolean,
						description: 'Whether or not to let you choose between found results',
						required: false
					}
				]
			},
			{
				name: 'location',
				description: 'Search for a location',
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'query',
						type: ApplicationCommandOptionType.String,
						description: 'The location you want to search',
						required: true
					}
				]
			},
			{
				name: 'tiktok',
				description: "Search for a user's posts on TikTok",
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'user',
						type: ApplicationCommandOptionType.String,
						description: 'The user you want to search (without @)',
						required: true
					}
				]
			}
		]
	},
	{
		name: 'random',
		description: 'Get a random image of an animal',
		options: [
			{
				name: 'animal',
				type: ApplicationCommandOptionType.String,
				description: 'The animal of which you want an image',
				required: true,
				choices: [
					{
						name: 'bird',
						value: 'bird'
					},
					{
						name: 'cat',
						value: 'cat'
					},
					{
						name: 'dog',
						value: 'dog'
					},
					{
						name: 'duck',
						value: 'duck'
					},
					{
						name: 'fox',
						value: 'fox'
					},
					{
						name: 'koala',
						value: 'koala'
					},
					{
						name: 'panda',
						value: 'panda'
					}
				]
			}
		]
	},
	{
		name: 'play',
		description: 'Play something with friends',
		options: [
			{
				name: 'connect4',
				description: 'Play connect 4 with a friend',
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'user',
						type: ApplicationCommandOptionType.User,
						description: 'The friend you want to play with',
						required: true
					}
				]
			},
			{
				name: 'tictactoe',
				description: 'Play tictactoe (beta) with a friend',
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'user',
						type: ApplicationCommandOptionType.User,
						description: 'The friend you want to play with',
						required: true
					}
				]
			},
			{
				name: 'horse-race',
				description: 'Play a horse race (alone)',
				type: ApplicationCommandOptionType.Subcommand
			}
		]
	},
	{
		name: 'infraction',
		description: 'Search, edit or delete infractions',
		options: [
			{
				name: 'search',
				description: 'Search for infractions by a user',
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'user',
						type: ApplicationCommandOptionType.User,
						description: 'The user you want to search infractions for',
						required: true
					}
				]
			},
			{
				name: 'modify',
				description: 'Modify an infraction',
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'id',
						type: ApplicationCommandOptionType.String,
						description: 'The ID of the infraction',
						required: true
					},
					{
						name: 'duration',
						type: ApplicationCommandOptionType.String,
						description: 'The new duration of the infraction',
						required: false
					},
					{
						name: 'reason',
						type: ApplicationCommandOptionType.String,
						description: 'The new reason of the infraction',
						required: false
					}
				]
			},
			{
				name: 'delete',
				description: 'Delete an infraction',
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'id',
						type: ApplicationCommandOptionType.String,
						description: 'The ID of the infraction',
						required: true
					}
				]
			}
		]
	},
	{
		name: 'image',
		description: 'Apply effects to an image',
		options: [
			{
				name: 'contrast',
				description: 'Apply contrast to an image',
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'image',
						type: ApplicationCommandOptionType.String,
						description: 'The URL of the image',
						required: false
					},
					{
						name: 'user-avatar',
						type: ApplicationCommandOptionType.User,
						description: 'The user you want to get the image from',
						required: false
					},
					{
						name: 'attachment',
						type: ApplicationCommandOptionType.Attachment,
						description: 'Use this if you want to apply the effect to the uplaoded file',
						required: false
					}
				]
			},
			{
				name: 'glitch',
				description: 'Apply a glitch effect to an image',
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'image',
						type: ApplicationCommandOptionType.String,
						description: 'The URL of the image',
						required: false
					},
					{
						name: 'user-avatar',
						type: ApplicationCommandOptionType.User,
						description: 'The user you want to get the image from',
						required: false
					},
					{
						name: 'attachment',
						type: ApplicationCommandOptionType.Attachment,
						description: 'Use this if you want to apply the effect to the uplaoded file',
						required: false
					}
				]
			},
			{
				name: 'magik',
				description: 'Apply a distort effect to an image',
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'image',
						type: ApplicationCommandOptionType.String,
						description: 'The URL of the image',
						required: false
					},
					{
						name: 'user-avatar',
						type: ApplicationCommandOptionType.User,
						description: 'The user you want to get the image from',
						required: false
					},
					{
						name: 'attachment',
						type: ApplicationCommandOptionType.Attachment,
						description: 'Use this if you want to apply the effect to the uplaoded file',
						required: false
					}
				]
			},
			{
				name: 'grayscale',
				description: 'Change the image colors to gray',
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'image',
						type: ApplicationCommandOptionType.String,
						description: 'The URL of the image',
						required: false
					},
					{
						name: 'user-avatar',
						type: ApplicationCommandOptionType.User,
						description: 'The user you want to get the image from',
						required: false
					},
					{
						name: 'attachment',
						type: ApplicationCommandOptionType.Attachment,
						description: 'Use this if you want to apply the effect to the uplaoded file',
						required: false
					}
				]
			},
			{
				name: 'invert',
				description: 'Invert the image colors',
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'image',
						type: ApplicationCommandOptionType.String,
						description: 'The URL of the image',
						required: false
					},
					{
						name: 'user-avatar',
						type: ApplicationCommandOptionType.User,
						description: 'The user you want to get the image from',
						required: false
					},
					{
						name: 'attachment',
						type: ApplicationCommandOptionType.Attachment,
						description: 'Use this if you want to apply the effect to the uplaoded file',
						required: false
					}
				]
			},
			{
				name: 'sepia',
				description: 'Change the image colors to sepia',
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'image',
						type: ApplicationCommandOptionType.String,
						description: 'The URL of the image',
						required: false
					},
					{
						name: 'user-avatar',
						type: ApplicationCommandOptionType.User,
						description: 'The user you want to get the image from',
						required: false
					},
					{
						name: 'attachment',
						type: ApplicationCommandOptionType.Attachment,
						description: 'Use this if you want to apply the effect to the uplaoded file',
						required: false
					}
				]
			}
		]
	},
	{
		name: 'edit',
		description: 'Edit your profile settings',
		options: [
			{
				name: 'profile-image',
				description: 'Set your profile image (use /help profile-image to see every availabe image)',
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'image',
						type: ApplicationCommandOptionType.String,
						description: 'The ID of the image',
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
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'description',
						type: ApplicationCommandOptionType.String,
						description: 'Your new description',
						required: true
					}
				]
			},
			{
				name: 'profile-text',
				description: 'Set your profile text',
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'text',
						type: ApplicationCommandOptionType.String,
						description: 'Your new text',
						required: true
					}
				]
			},
			{
				name: 'rank-image',
				description: 'Set your rank image (use /help rank-image to see every availabe image)',
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'image',
						type: ApplicationCommandOptionType.String,
						description: 'The ID of the image',
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
		name: 'queue',
		description: 'Add, remove or view the songs in the current queue',
		options: [
			{
				name: 'play',
				description: 'Add a song to the queue',
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'song',
						type: ApplicationCommandOptionType.String,
						description: 'The song you want to add',
						required: true
					},
					{
						name: 'confirm-result',
						type: ApplicationCommandOptionType.Boolean,
						description: 'Whether or not to let you choose between found results',
						required: false
					}
				]
			},
			{
				name: 'remove',
				description: 'Remove a song from the queue',
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'id',
						type: ApplicationCommandOptionType.String,
						description: 'ID (number) of the song to remove',
						required: true
					},
					{
						name: 'slice',
						type: ApplicationCommandOptionType.Boolean,
						description: 'Whether to remove all songs queued after this one or not.',
						required: false
					}
				]
			},
			{
				name: 'move',
				description: 'Move a song from the queue to another position',
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'current',
						type: ApplicationCommandOptionType.String,
						description: 'The current position of the song',
						required: true
					},
					{
						name: 'new',
						type: ApplicationCommandOptionType.String,
						description: 'The new position of the song',
						required: true
					}
				]
			},
			{
				name: 'view',
				description: 'View the queue',
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'page',
						type: ApplicationCommandOptionType.String,
						description: 'The page of the queue you want to view',
						required: false
					}
				]
			},
			{
				name: 'voteskip',
				description: 'Vote to skip to the next song in queue',
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'to',
						type: ApplicationCommandOptionType.String,
						description: 'The song you want to skip to',
						required: false
					}
				]
			},
			{
				name: 'forceskip',
				description: 'Skip to the next song in queue (permission needed)',
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'to',
						type: ApplicationCommandOptionType.String,
						description: 'The song you want to skip to',
						required: false
					}
				]
			},
			{
				name: 'stop',
				description: 'Make the bot leave and delete all the queue',
				type: ApplicationCommandOptionType.Subcommand
			},
			{
				name: 'volume',
				description: 'Change or view the current volume (default: 1)',
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'value',
						type: ApplicationCommandOptionType.String,
						description: 'The new volume',
						required: false
					}
				]
			},
			{
				name: 'current-song',
				description: 'View or modify the current song',
				type: ApplicationCommandOptionType.SubcommandGroup,
				options: [
					{
						name: 'view',
						type: ApplicationCommandOptionType.Subcommand,
						description: 'View the currently playing song'
					},
					{
						name: 'pause',
						type: ApplicationCommandOptionType.Subcommand,
						description: 'Pause the currently playing song'
					},
					{
						name: 'resume',
						type: ApplicationCommandOptionType.Subcommand,
						description: 'Unpause the currently playing song'
					},
					{
						name: 'seek',
						type: ApplicationCommandOptionType.Subcommand,
						description: 'Jump to a specified part of the currently playing song',
						options: [
							{
								name: 'timestamp',
								type: ApplicationCommandOptionType.String,
								description: 'Part of the song where you want to jump to (mm:ss)',
								required: true
							}
						]
					}
				]
			},
			{
				name: 'loop',
				description: 'Loop the whole queue',
				type: ApplicationCommandOptionType.Subcommand
			},
			{
				name: 'shuffle',
				description: 'Shuffle mode (random)',
				type: ApplicationCommandOptionType.Subcommand
			},
			{
				name: 'autoplay',
				description: 'Automatically play songs when there is nothing left on the queue',
				type: ApplicationCommandOptionType.Subcommand
			}
		]
	},
	{
		name: 'about',
		description: 'Get info about the bot'
	},
	{
		name: 'profile',
		description: 'Get your profile card',
		options: [
			{
				name: 'user',
				type: ApplicationCommandOptionType.User,
				description: 'The user whose profile card you want to see',
				required: false
			}
		]
	},
	{
		name: 'rank',
		description: 'Get your rank card',
		options: [
			{
				name: 'user',
				type: ApplicationCommandOptionType.User,
				description: 'The user whose rank card you want to see',
				required: false
			}
		]
	},
	{
		name: 'rep',
		description: 'Give a reputation point to someone',
		options: [
			{
				name: 'user',
				type: ApplicationCommandOptionType.User,
				description: 'The user to whom you want to give a reputation point',
				required: true
			}
		]
	},
	{
		name: 'top',
		description: 'Get the activity leaderboard',
		options: [
			{
				name: 'global',
				description: 'Whether or not to get the global top',
				type: ApplicationCommandOptionType.Boolean,
				required: false
			}
		]
	},
	{
		name: 'today-in-history',
		description: 'Get information about today in history'
	},
	{
		name: 'feedback',
		description: 'Send some feedback about the bot to the developer'
	},
	{
		name: 'binary',
		description: 'Encode or decode binary',
		options: [
			{
				name: 'action',
				type: ApplicationCommandOptionType.String,
				description: 'The action you want to perform',
				required: true,
				choices: [
					{
						name: 'Encode',
						value: 'encode_binary'
					},
					{
						name: 'Decode',
						value: 'decode_binary'
					}
				]
			},
			{
				name: 'text',
				type: ApplicationCommandOptionType.String,
				description: 'The text to encode or decode',
				required: true
			}
		]
	},
	{
		name: 'calculate',
		description: 'Calculate the given expresion',
		options: [
			{
				name: 'expression',
				type: ApplicationCommandOptionType.String,
				description: 'The expression you want to calculate',
				required: true
			}
		]
	},
	{
		name: 'embed',
		description: 'Build an embed',
		options: [
			{
				name: 'json',
				type: ApplicationCommandOptionType.String,
				description: 'OPTIONAL: The JSON code of the embed',
				required: false
			},
			{
				name: 'title',
				type: ApplicationCommandOptionType.String,
				description: 'The title of the embed',
				required: false
			},
			{
				name: 'description',
				type: ApplicationCommandOptionType.String,
				description: 'The description of the embed',
				required: false
			},
			{
				name: 'footer',
				type: ApplicationCommandOptionType.String,
				description: 'The footer of the embed',
				required: false
			},
			{
				name: 'thumbnail',
				type: ApplicationCommandOptionType.String,
				description: 'The thumbnail of the embed',
				required: false
			},
			{
				name: 'image',
				type: ApplicationCommandOptionType.String,
				description: 'The image of the embed',
				required: false
			},
			{
				name: 'color',
				type: ApplicationCommandOptionType.String,
				description: 'The color of the embed',
				required: false
			}
		]
	},
	{
		name: 'jumbo',
		description: 'Get the image (png) of an emoji',
		options: [
			{
				name: 'emoji',
				description: 'The emoji you want to get the image from',
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
				type: ApplicationCommandOptionType.Boolean,
				required: false
			}
		]
	},
	{
		name: 'remind',
		description: 'View or add a reminder',
		options: [
			{
				name: 'list',
				description: 'View your reminder list',
				type: ApplicationCommandOptionType.Subcommand
			},
			{
				name: 'new',
				description: 'Set a new reminder',
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'reminder',
						type: ApplicationCommandOptionType.String,
						description: 'What do you want me to remind you?',
						required: true
					},
					{
						name: 'time',
						type: ApplicationCommandOptionType.String,
						description: 'When do you want me to remind you? (1d, 30m, 2mo...)',
						required: true
					}
				]
			}
		]
	},
	{
		name: 'sauce',
		description: 'Get the source of an image',
		options: [
			{
				name: 'image',
				type: ApplicationCommandOptionType.String,
				description: 'The URL of the image',
				required: false
			},
			{
				name: 'user-avatar',
				type: ApplicationCommandOptionType.User,
				description: 'The user you want to get the image from',
				required: false
			},
			{
				name: 'attachment',
				type: ApplicationCommandOptionType.Attachment,
				description: 'Use this if you want to select the uplaoded file',
				required: false
			}
		]
	},
	{
		name: 'convert',
		description: 'Convert units to other units',
		options: [
			{
				name: 'amount',
				type: ApplicationCommandOptionType.String,
				description: 'The amount of base unit you want to convert',
				required: true
			},
			{
				name: 'base-unit',
				type: ApplicationCommandOptionType.String,
				description: 'The base unit (p.e, cm)',
				required: true
			},
			{
				name: 'target-unit',
				type: ApplicationCommandOptionType.String,
				description: 'The target unit (p.e, m)',
				required: true
			}
		]
	},
	{
		name: 'time-zone',
		description: 'Get the current time of the zone you want',
		options: [
			{
				name: 'zone',
				type: ApplicationCommandOptionType.String,
				description: 'Country, city... to get the time from',
				required: true
			}
		]
	},
	{
		name: 'translate',
		description: 'Translate something',
		options: [
			{
				name: 'to',
				type: ApplicationCommandOptionType.String,
				description: 'Language to translate (en, es...)',
				required: true
			},
			{
				name: 'text',
				type: ApplicationCommandOptionType.String,
				description: 'The text to translate',
				required: true
			}
		]
	},
	{
		name: 'setlevel',
		description: "Set someone's level (only admin)",
		options: [
			{
				name: 'user',
				type: ApplicationCommandOptionType.User,
				description: 'The user',
				required: true
			},
			{
				name: 'level',
				type: ApplicationCommandOptionType.String,
				description: 'The new level of the user',
				required: true
			}
		]
	},
	{
		name: 'leveledroles',
		description: 'Add, remove or view the leveled roles in the server',
		options: [
			{
				name: 'add',
				description: 'Add a leveled role',
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'role',
						type: ApplicationCommandOptionType.Role,
						description: 'The role you want to add',
						required: true
					},
					{
						name: 'level',
						type: ApplicationCommandOptionType.String,
						description: 'The level at which you want to give the role',
						required: true
					}
				]
			},
			{
				name: 'remove',
				description: 'Remove a leveled role',
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'role',
						type: ApplicationCommandOptionType.Role,
						description: 'The role you want to remove from the list',
						required: true
					},
					{
						name: 'level',
						type: ApplicationCommandOptionType.String,
						description: 'The level at which the role is given',
						required: true
					}
				]
			},
			{
				name: 'view',
				description: 'View the leveled roles list',
				type: ApplicationCommandOptionType.Subcommand
			}
		]
	},
	{
		name: 'youtube-together',
		description: 'Watch YouTube with friends (only desktop currently)'
	},
	{
		name: 'avatar',
		description: "Get some user's avatar",
		options: [
			{
				name: 'user',
				type: ApplicationCommandOptionType.User,
				description: 'The user you want to get the avatar from',
				required: false
			}
		]
	},
	{
		name: 'info',
		description: "Get some user's profile information",
		options: [
			{
				name: 'user',
				type: ApplicationCommandOptionType.User,
				description: 'The user you want to get information from',
				required: false
			}
		]
	},
	{
		name: 'server',
		description: 'Get the server information'
	},
	{
		name: 'help',
		description: 'Get help about something related to the bot',
		options: [
			{
				name: 'command',
				type: ApplicationCommandOptionType.String,
				description: 'The command with which you need help',
				required: false
			}
		]
	},
	{
		name: 'invite',
		description: 'Invite the bot to your server'
	},
	{
		name: 'bot-info',
		description: 'Get info about the bot'
	},
	// {
	// 	name: 'world',
	// 	description: 'Get info about the world'
	// },
	{
		name: 'cuddle',
		description: 'Cuddle with someone',
		options: [
			{
				name: 'user',
				type: ApplicationCommandOptionType.User,
				description: 'The user you want to cuddle with',
				required: false
			}
		]
	},
	{
		name: 'hug',
		description: 'Hug someone',
		options: [
			{
				name: 'user',
				type: ApplicationCommandOptionType.User,
				description: 'The user you want to hug',
				required: false
			}
		]
	},
	{
		name: 'kiss',
		description: 'Kiss someone',
		options: [
			{
				name: 'user',
				type: ApplicationCommandOptionType.User,
				description: 'The user you want to kiss',
				required: false
			}
		]
	},
	{
		name: 'pat',
		description: 'Pat someone',
		options: [
			{
				name: 'user',
				type: ApplicationCommandOptionType.User,
				description: 'The user you want to pat',
				required: false
			}
		]
	},
	{
		name: 'poke',
		description: 'Poke someone',
		options: [
			{
				name: 'user',
				type: ApplicationCommandOptionType.User,
				description: 'The user you want to poke',
				required: false
			}
		]
	},
	{
		name: 'slap',
		description: "Slap someone's face",
		options: [
			{
				name: 'user',
				type: ApplicationCommandOptionType.User,
				description: 'The user you want to faceslap',
				required: false
			}
		]
	},
	{
		name: 'ban',
		description: 'Permanently ban someone',
		options: [
			{
				name: 'user',
				type: ApplicationCommandOptionType.User,
				description: 'The user you want to ban',
				required: true
			},
			{
				name: 'reason',
				type: ApplicationCommandOptionType.String,
				description: 'The reason for your ban',
				required: true
			},
			{
				name: 'notify',
				type: ApplicationCommandOptionType.Boolean,
				description: 'Whether or not to notify the user',
				required: false
			}
		]
	},
	{
		name: 'kick',
		description: 'Kick someone of the server',
		options: [
			{
				name: 'user',
				type: ApplicationCommandOptionType.User,
				description: 'The user you want to kick',
				required: true
			},
			{
				name: 'reason',
				type: ApplicationCommandOptionType.String,
				description: 'The reason for your kick',
				required: true
			},
			{
				name: 'notify',
				type: ApplicationCommandOptionType.Boolean,
				description: 'Whether or not to notify the user',
				required: false
			}
		]
	},
	{
		name: 'warn',
		description: 'Warn someone',
		options: [
			{
				name: 'user',
				type: ApplicationCommandOptionType.User,
				description: 'The user you want to warn',
				required: true
			},
			{
				name: 'reason',
				type: ApplicationCommandOptionType.String,
				description: 'The reason for your warn',
				required: true
			},
			{
				name: 'notify',
				type: ApplicationCommandOptionType.Boolean,
				description: 'Whether or not to notify the user',
				required: false
			}
		]
	},
	{
		name: 'timeout',
		description: 'Times this member guild out (0 to clear the timeout)',
		options: [
			{
				name: 'user',
				type: ApplicationCommandOptionType.User,
				description: 'The user you want to time out',
				required: true
			},
			{
				name: 'duration',
				type: ApplicationCommandOptionType.String,
				description: 'The duration of the time out, for example 1h (0 to clear the timeout)',
				required: true
			},
			{
				name: 'reason',
				type: ApplicationCommandOptionType.String,
				description: 'The reason for your time out',
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
				required: true
			},
			{
				name: 'reason',
				type: ApplicationCommandOptionType.String,
				description: 'The reason for your ban',
				required: true
			},
			{
				name: 'duration',
				type: ApplicationCommandOptionType.String,
				description: 'The duration of the ban (1d, 5h...)',
				required: true
			},
			{
				name: 'notify',
				type: ApplicationCommandOptionType.Boolean,
				description: 'Whether or not to notify the user',
				required: false
			}
		]
	},
	{
		name: 'mute',
		description: 'Mute someone',
		options: [
			{
				name: 'user',
				type: ApplicationCommandOptionType.User,
				description: 'The user you want to mute',
				required: true
			},
			{
				name: 'reason',
				type: ApplicationCommandOptionType.String,
				description: 'The reason for your mute',
				required: true
			},
			{
				name: 'duration',
				type: ApplicationCommandOptionType.String,
				description: 'The duration of the mute (1d, 5h...)',
				required: false
			},
			{
				name: 'notify',
				type: ApplicationCommandOptionType.Boolean,
				description: 'Whether or not to notify the user',
				required: false
			}
		]
	},
	{
		name: 'unmute',
		description: 'Unmute someone already muted',
		options: [
			{
				name: 'user',
				type: ApplicationCommandOptionType.User,
				description: 'The user you want to unmute',
				required: true
			},
			{
				name: 'reason',
				type: ApplicationCommandOptionType.String,
				description: 'The reason for your unmute',
				required: false
			}
		]
	},
	{
		name: 'forceban',
		description: 'Permanently ban someone that is not in the server',
		options: [
			{
				name: 'user',
				type: ApplicationCommandOptionType.String,
				description: 'The id of the user you want to ban',
				required: true
			},
			{
				name: 'reason',
				type: ApplicationCommandOptionType.String,
				description: 'The reason for your ban',
				required: true
			}
		]
	},
	{
		name: 'role',
		description: 'Add or remove a role to a user',
		options: [
			{
				name: 'add',
				description: 'Add a role',
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'user',
						type: ApplicationCommandOptionType.User,
						description: 'The user you want to give the role',
						required: true
					},
					{
						name: 'role',
						type: ApplicationCommandOptionType.Role,
						description: 'The role you want to add',
						required: true
					}
				]
			},
			{
				name: 'remove',
				description: 'Remove a role',
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: 'user',
						type: ApplicationCommandOptionType.User,
						description: 'The user you want to remove the role',
						required: true
					},
					{
						name: 'role',
						type: ApplicationCommandOptionType.Role,
						description: 'The role you want to remove',
						required: true
					}
				]
			}
		]
	},
	{
		name: 'mban',
		description: 'Ban multiple users permanently with one command',
		options: [
			{
				name: 'users',
				type: ApplicationCommandOptionType.String,
				description: 'The ID of the users you want to ban separated by a space',
				required: true
			},
			{
				name: 'reason',
				type: ApplicationCommandOptionType.String,
				description: 'The reason for your ban',
				required: true
			}
		]
	},
	{
		name: 'mkick',
		description: 'Kick multiple users with one command',
		options: [
			{
				name: 'users',
				type: ApplicationCommandOptionType.String,
				description: 'The ID of the users you want to kick separated by a space',
				required: true
			},
			{
				name: 'reason',
				type: ApplicationCommandOptionType.String,
				description: 'The reason for your kick',
				required: true
			}
		]
	},
	{
		name: 'lock',
		description: 'Lock the current channel',
		options: [
			{
				name: 'role',
				type: ApplicationCommandOptionType.Role,
				description: 'The role you want to be locked (leave in blank if @everyone)',
				required: false
			}
		]
	},
	{
		name: 'unlock',
		description: 'unlock the current channel',
		options: [
			{
				name: 'role',
				type: ApplicationCommandOptionType.Role,
				description: 'The role you want to be unlocked (leave in blank if @everyone)',
				required: false
			}
		]
	},
	{
		name: 'Translate',
		type: ApplicationCommandType.Message
	},
	{
		name: 'Get sauce',
		type: ApplicationCommandType.Message
	},
	{
		name: 'Add to queue',
		type: ApplicationCommandType.Message
	},
	{
		name: 'Information',
		type: ApplicationCommandType.User
	},
	{
		name: 'Avatar',
		type: ApplicationCommandType.User
	},
	{
		name: 'Invite to YT Together',
		type: ApplicationCommandType.User
	},
	{
		name: 'Play Connect 4',
		type: ApplicationCommandType.User
	},
	{
		name: 'Play Tic Tac Toe',
		type: ApplicationCommandType.User
	}
];
