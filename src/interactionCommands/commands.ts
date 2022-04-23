export default [
	{
		name: 'set',
		description: 'Set some configuration',
		options: [
			{
				name: 'autorole',
				description: 'Set the autorole',
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'role',
						type: 'ROLE',
						description: 'The new autorole',
						required: true
					}
				]
			},
			{
				name: 'admin-role',
				description: 'Set the admin role',
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'role',
						type: 'ROLE',
						description: 'The new admin role',
						required: true
					}
				]
			},
			{
				name: 'mod-role',
				description: 'Set the moderator role',
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'role',
						type: 'ROLE',
						description: 'The new moderator role',
						required: true
					}
				]
			},
			{
				name: 'antispam',
				description: 'Set the antispam feature',
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'enable',
						type: 'BOOLEAN',
						description: 'Whether to enable the antispam feature',
						required: true
					}
				]
			},
			{
				name: 'prefix',
				description: 'Set the prefix',
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'prefix',
						type: 'STRING',
						description: 'The new prefix',
						required: true
					}
				]
			},
			{
				name: 'language',
				description: "Set the language (does not affect slash commands' description)",
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'language',
						type: 'STRING',
						description: 'The new language',
						required: true,
						choices: [
							{
								name: 'Spanish (español)',
								value: 'lang_es'
							},
							{
								name: 'English',
								value: 'lang_en'
							}
						]
					}
				]
			},
			{
				name: 'welcome',
				description: 'Set the welcome config',
				type: 'SUB_COMMAND_GROUP',
				options: [
					{
						name: 'channel',
						type: 'SUB_COMMAND',
						description: 'The welcome channel',
						required: false,
						options: [
							{
								name: 'channel',
								type: 'CHANNEL',
								description: 'The new channel',
								required: true
							}
						]
					},
					{
						name: 'color',
						type: 'SUB_COMMAND',
						description: 'The welcome title color',
						required: false,
						options: [
							{
								name: 'color',
								type: 'STRING',
								description: 'The new color',
								required: true
							}
						]
					},
					{
						name: 'image',
						type: 'SUB_COMMAND',
						description: 'The welcome background image',
						required: false,
						options: [
							{
								name: 'image',
								type: 'STRING',
								description: 'The new image URL',
								required: true
							}
						]
					}
				]
			},
			{
				name: 'actions-logs-channel',
				description: 'Set the actions logs channel',
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'channel',
						type: 'CHANNEL',
						description: 'The new channel',
						required: true
					}
				]
			},
			{
				name: 'infractions-logs-channel',
				description: 'Set the infractions logs channel',
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'channel',
						type: 'CHANNEL',
						description: 'The new channel',
						required: true
					}
				]
			},
			{
				name: 'members-logs-channel',
				description: 'Set the members logs channel',
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'channel',
						type: 'CHANNEL',
						description: 'The new channel',
						required: true
					}
				]
			},
			{
				name: 'messages-logs-channel',
				description: 'Set the messages logs channel',
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'channel',
						type: 'CHANNEL',
						description: 'The new channel',
						required: true
					}
				]
			},
			{
				name: 'server-logs-channel',
				description: 'Set the server logs channel',
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'channel',
						type: 'CHANNEL',
						description: 'The new channel',
						required: true
					}
				]
			},
			{
				name: 'voice-logs-channel',
				description: 'Set the voice logs channel',
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'channel',
						type: 'CHANNEL',
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
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'query',
						type: 'STRING',
						description: 'The anime to search',
						required: true
					},
					{
						name: 'confirm-result',
						type: 'BOOLEAN',
						description: 'Whether or not to search for more than one result to choose.',
						required: false
					}
				]
			},
			{
				name: 'manga',
				description: 'Search for a manga',
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'query',
						type: 'STRING',
						description: 'The manga to search',
						required: true
					},
					{
						name: 'confirm-result',
						type: 'BOOLEAN',
						description: 'Whether or not to search for more than one result to choose.',
						required: false
					}
				]
			},
			{
				name: 'image',
				description: 'Search for an image ',
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'query',
						type: 'STRING',
						description: 'The image to search',
						required: true
					}
				]
			},
			{
				name: 'game',
				description: 'Search for a game',
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'query',
						type: 'STRING',
						description: 'The game to search',
						required: true
					},
					{
						name: 'confirm-result',
						type: 'BOOLEAN',
						description: 'Whether or not to search for more than one result to choose.',
						required: false
					}
				]
			},
			{
				name: 'location',
				description: 'Search for a location',
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'query',
						type: 'STRING',
						description: 'The location to search',
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
				type: 'STRING',
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
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'user',
						type: 'USER',
						description: 'The friend you want to play with',
						required: true
					}
				]
			},
			{
				name: 'tictactoe',
				description: 'Play tictactoe (beta) with a friend',
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'user',
						type: 'USER',
						description: 'The friend you want to play with',
						required: true
					}
				]
			},
			{
				name: 'horse-race',
				description: 'Play a horse race (alone)',
				type: 'SUB_COMMAND'
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
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'user',
						type: 'USER',
						description: 'The user you want to search infractions for',
						required: true
					}
				]
			},
			{
				name: 'modify',
				description: 'Modify an infraction',
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'id',
						type: 'STRING',
						description: 'The ID of the infraction',
						required: true
					},
					{
						name: 'duration',
						type: 'STRING',
						description: 'The new duration of the infraction',
						required: false
					},
					{
						name: 'reason',
						type: 'STRING',
						description: 'The new reason of the infraction',
						required: false
					}
				]
			},
			{
				name: 'delete',
				description: 'Delete an infraction',
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'id',
						type: 'STRING',
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
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'image',
						type: 'STRING',
						description: 'The URL of the image',
						required: false
					},
					{
						name: 'user-avatar',
						type: 'USER',
						description: 'The user you want to get the image from',
						required: false
					}
				]
			},
			{
				name: 'glitch',
				description: 'Apply a glitch effect to an image',
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'image',
						type: 'STRING',
						description: 'The URL of the image',
						required: false
					},
					{
						name: 'user-avatar',
						type: 'USER',
						description: 'The user you want to get the image from',
						required: false
					}
				]
			},
			{
				name: 'magik',
				description: 'Apply a distort effect to an image',
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'image',
						type: 'STRING',
						description: 'The URL of the image',
						required: false
					},
					{
						name: 'user-avatar',
						type: 'USER',
						description: 'The user you want to get the image from',
						required: false
					}
				]
			},
			{
				name: 'grayscale',
				description: 'Change the image colors to gray',
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'image',
						type: 'STRING',
						description: 'The URL of the image',
						required: false
					},
					{
						name: 'user-avatar',
						type: 'USER',
						description: 'The user you want to get the image from',
						required: false
					}
				]
			},
			{
				name: 'invert',
				description: 'Invert the image colors',
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'image',
						type: 'STRING',
						description: 'The URL of the image',
						required: false
					},
					{
						name: 'user-avatar',
						type: 'USER',
						description: 'The user you want to get the image from',
						required: false
					}
				]
			},
			{
				name: 'sepia',
				description: 'Change the image colors to sepia',
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'image',
						type: 'STRING',
						description: 'The URL of the image',
						required: false
					},
					{
						name: 'user-avatar',
						type: 'USER',
						description: 'The user you want to get the image from',
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
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'image',
						type: 'STRING',
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
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'description',
						type: 'STRING',
						description: 'Your new description',
						required: true
					}
				]
			},
			{
				name: 'profile-text',
				description: 'Set your profile text',
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'text',
						type: 'STRING',
						description: 'Your new text',
						required: true
					}
				]
			},
			{
				name: 'rank-image',
				description: 'Set your rank image (use /help rank-image to see every availabe image)',
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'image',
						type: 'STRING',
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
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'song',
						type: 'STRING',
						description: 'The song you want to add',
						required: true
					},
					{
						name: 'confirm-result',
						type: 'BOOLEAN',
						description: 'Whether or not to search for more than one result to choose.',
						required: false
					}
				]
			},
			{
				name: 'remove',
				description: 'Remove a song from the queue',
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'id',
						type: 'STRING',
						description: 'ID (number) of the song to remove',
						required: true
					},
					{
						name: 'slice',
						type: 'BOOLEAN',
						description: 'Whether to remove all songs queued after this one or not.',
						required: false
					}
				]
			},
			{
				name: 'view',
				description: 'View the queue',
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'page',
						type: 'STRING',
						description: 'The page of the queue you want to view',
						required: false
					}
				]
			},
			{
				name: 'voteskip',
				description: 'Vote to skip to the next song in queue',
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'to',
						type: 'STRING',
						description: 'The song you want to skip to',
						required: false
					}
				]
			},
			{
				name: 'forceskip',
				description: 'Skip to the next song in queue (permission needed)',
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'to',
						type: 'STRING',
						description: 'The song you want to skip to',
						required: false
					}
				]
			},
			{
				name: 'stop',
				description: 'Make the bot leave and delete all the queue',
				type: 'SUB_COMMAND'
			},
			{
				name: 'volume',
				description: 'Change or view the current volume (default: 1)',
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'value',
						type: 'STRING',
						description: 'The new volume',
						required: false
					}
				]
			},
			{
				name: 'current-song',
				description: 'View or modify the current song',
				type: 'SUB_COMMAND_GROUP',
				options: [
					{
						name: 'view',
						type: 'SUB_COMMAND',
						description: 'View the currently playing song'
					},
					{
						name: 'pause',
						type: 'SUB_COMMAND',
						description: 'Pause the currently playing song'
					},
					{
						name: 'resume',
						type: 'SUB_COMMAND',
						description: 'Unpause the currently playing song'
					},
					{
						name: 'seek',
						type: 'SUB_COMMAND',
						description: 'Jump to a specified part of the currently playing song',
						options: [
							{
								name: 'timestamp',
								type: 'STRING',
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
				type: 'SUB_COMMAND'
			},
			{
				name: 'shuffle',
				description: 'Shuffle mode (random)',
				type: 'SUB_COMMAND'
			},
			{
				name: 'autoplay',
				description: 'Automatically play songs when there is nothing left on the queue',
				type: 'SUB_COMMAND'
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
				type: 'USER',
				description: 'The user which you want to see the profile',
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
				type: 'USER',
				description: 'The user which you want to see the rank',
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
				type: 'USER',
				description: 'The user you want to give a reputation point to',
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
				type: 'BOOLEAN',
				required: false
			}
		]
	},
	{
		name: 'today-in-history',
		description: 'Get information about today in history'
	},
	{
		name: 'binary',
		description: 'Encode or decode binary',
		options: [
			{
				name: 'action',
				type: 'STRING',
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
				type: 'STRING',
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
				type: 'STRING',
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
				type: 'STRING',
				description: 'OPTIONAL: The JSON code of the embed',
				required: false
			},
			{
				name: 'title',
				type: 'STRING',
				description: 'The title of the embed',
				required: false
			},
			{
				name: 'description',
				type: 'STRING',
				description: 'The description of the embed',
				required: false
			},
			{
				name: 'footer',
				type: 'STRING',
				description: 'The footer of the embed',
				required: false
			},
			{
				name: 'thumbnail',
				type: 'STRING',
				description: 'The thumbnail of the embed',
				required: false
			},
			{
				name: 'image',
				type: 'STRING',
				description: 'The image of the embed',
				required: false
			},
			{
				name: 'color',
				type: 'STRING',
				description: 'The color of the embed',
				required: false
			},
			{
				name: 'field-title-1',
				type: 'STRING',
				description: 'The title of the first field',
				required: false
			},
			{
				name: 'field-content-1',
				type: 'STRING',
				description: 'The content of the first field',
				required: false
			},
			{
				name: 'field-title-2',
				type: 'STRING',
				description: 'The title of the second field',
				required: false
			},
			{
				name: 'field-content-2',
				type: 'STRING',
				description: 'The content of the second field',
				required: false
			},
			{
				name: 'field-title-3',
				type: 'STRING',
				description: 'The title of the third field',
				required: false
			},
			{
				name: 'field-content-3',
				type: 'STRING',
				description: 'The content of the third field',
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
				type: 'STRING',
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
				type: 'BOOLEAN',
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
				type: 'SUB_COMMAND'
			},
			{
				name: 'new',
				description: 'Set a new reminder',
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'reminder',
						type: 'STRING',
						description: 'What do you want me to remind you?',
						required: true
					},
					{
						name: 'time',
						type: 'STRING',
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
				type: 'STRING',
				description: 'The URL of the image',
				required: false
			},
			{
				name: 'user-avatar',
				type: 'USER',
				description: 'The user you want to get the image from',
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
				type: 'STRING',
				description: 'The amount of base unit you want to convert',
				required: true
			},
			{
				name: 'base-unit',
				type: 'STRING',
				description: 'The base unit (p.e, cm)',
				required: true
			},
			{
				name: 'target-unit',
				type: 'STRING',
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
				type: 'STRING',
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
				type: 'STRING',
				description: 'Language to translate (en, es...)',
				required: true
			},
			{
				name: 'text',
				type: 'STRING',
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
				type: 'USER',
				description: 'The user',
				required: true
			},
			{
				name: 'level',
				type: 'STRING',
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
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'role',
						type: 'ROLE',
						description: 'The role you want to add',
						required: true
					},
					{
						name: 'level',
						type: 'STRING',
						description: 'The level at which you want to give the role',
						required: true
					}
				]
			},
			{
				name: 'remove',
				description: 'Remove a leveled role',
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'role',
						type: 'ROLE',
						description: 'The role you want to remove from the list',
						required: true
					},
					{
						name: 'level',
						type: 'STRING',
						description: 'The level at which the role is given',
						required: true
					}
				]
			},
			{
				name: 'view',
				description: 'View the leveled roles list',
				type: 'SUB_COMMAND'
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
				type: 'USER',
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
				type: 'USER',
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
				type: 'STRING',
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
	{
		name: 'world',
		description: 'Get info about the world'
	},
	{
		name: 'cuddle',
		description: 'Cuddle with someone',
		options: [
			{
				name: 'user',
				type: 'USER',
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
				type: 'USER',
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
				type: 'USER',
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
				type: 'USER',
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
				type: 'USER',
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
				type: 'USER',
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
				type: 'USER',
				description: 'The user you want to ban',
				required: true
			},
			{
				name: 'reason',
				type: 'STRING',
				description: 'The reason for your ban',
				required: true
			},
			{
				name: 'notify',
				type: 'BOOLEAN',
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
				type: 'USER',
				description: 'The user you want to kick',
				required: true
			},
			{
				name: 'reason',
				type: 'STRING',
				description: 'The reason for your kick',
				required: true
			},
			{
				name: 'notify',
				type: 'BOOLEAN',
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
				type: 'USER',
				description: 'The user you want to warn',
				required: true
			},
			{
				name: 'reason',
				type: 'STRING',
				description: 'The reason for your warn',
				required: true
			},
			{
				name: 'notify',
				type: 'BOOLEAN',
				description: 'Whether or not to notify the user',
				required: false
			}
		]
	},
	{
		name: 'unmute',
		description: 'Unmute a muted user',
		options: [
			{
				name: 'user',
				type: 'USER',
				description: 'The user you want to unmute',
				required: true
			}
		]
	},
	{
		name: 'timeout',
		description: 'Times this member guild out (0 to clear the timeout)',
		options: [
			{
				name: 'user',
				type: 'USER',
				description: 'The user you want to time out',
				required: true
			},
			{
				name: 'duration',
				type: 'STRING',
				description: 'The duration of the time out, for example 1h (0 to clear the timeout)',
				required: true
			},
			{
				name: 'reason',
				type: 'STRING',
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
				type: 'USER',
				description: 'The user you want to ban',
				required: true
			},
			{
				name: 'reason',
				type: 'STRING',
				description: 'The reason for your ban',
				required: true
			},
			{
				name: 'duration',
				type: 'STRING',
				description: 'The duration of the ban (1d, 5h...)',
				required: true
			},
			{
				name: 'notify',
				type: 'BOOLEAN',
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
				type: 'USER',
				description: 'The user you want to mute',
				required: true
			},
			{
				name: 'reason',
				type: 'STRING',
				description: 'The reason for your mute',
				required: true
			},
			{
				name: 'duration',
				type: 'STRING',
				description: 'The duration of the mute (1d, 5h...)',
				required: false
			},
			{
				name: 'notify',
				type: 'BOOLEAN',
				description: 'Whether or not to notify the user',
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
				type: 'STRING',
				description: 'The id of the user you want to ban',
				required: true
			},
			{
				name: 'reason',
				type: 'STRING',
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
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'user',
						type: 'USER',
						description: 'The user you want to give the role',
						required: true
					},
					{
						name: 'role',
						type: 'ROLE',
						description: 'The role you want to add',
						required: true
					}
				]
			},
			{
				name: 'remove',
				description: 'Remove a role',
				type: 'SUB_COMMAND',
				options: [
					{
						name: 'user',
						type: 'USER',
						description: 'The user you want to remove the role',
						required: true
					},
					{
						name: 'role',
						type: 'ROLE',
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
				type: 'STRING',
				description: 'The ID of the users you want to ban separated by a space',
				required: true
			},
			{
				name: 'reason',
				type: 'STRING',
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
				type: 'STRING',
				description: 'The ID of the users you want to kick separated by a space',
				required: true
			},
			{
				name: 'reason',
				type: 'STRING',
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
				type: 'ROLE',
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
				type: 'ROLE',
				description: 'The role you want to be unlocked (leave in blank if @everyone)',
				required: false
			}
		]
	},
	{
		name: 'Translate',
		type: 'MESSAGE'
	},
	{
		name: 'Get sauce',
		type: 'MESSAGE'
	},
	{
		name: 'Add to queue',
		type: 'MESSAGE'
	},
	{
		name: 'Information',
		type: 'USER'
	},
	{
		name: 'Avatar',
		type: 'USER'
	},
	{
		name: 'Invite to YT Together',
		type: 'USER'
	},
	{
		name: 'Play Connect 4',
		type: 'USER'
	},
	{
		name: 'Play Tic Tac Toe',
		type: 'USER'
	}
];
