# Trihammer

A Discord bot with a lot of commands and now open source!

## Installation

If you want to self host the bot, then edit .env.example and config.json.example with all your credentials and configuration and rename them to .env and config.json \
If you want to use the spotify api for music commands, read and follow [this guide](https://github.com/play-dl/play-dl/tree/9d24008a2be6e1d72af9af06fcb072ac5cd99a42/instructions#spotify).
- First, download the code manually or do it with git: `git clone https://github.com/k2helix/trihammer.git && cd trihammer`
- Now you will have to install the required packages: `npm install --legacy-peer-deps`
- Run it by using `tsc && node dist/src/index.js`

If for some reason attachments of some command stop working, renew the url with the assets in the assets folder.
### Notes
- If you are not using Heroku, you can remove its api key from .env and delete or edit the reset command. Same goes for top.gg and Sentry.
- If you want to add more slash commands, edit the commands.ts file in src/interactionCommands and deploy them with t-deploy.

I'm a bit lazy and some things are very improvable, I'm conscious.

## Useful Links
- [Discord Server](https://discord.gg/EjG6XZs)
- [Invite the bot](https://discord.com/oauth2/authorize?client_id=611710846426415107&permissions=8&scope=bot%20applications.commands)

## Issues
If you find any issue, please open an issue and describe it, I'll check what I can do!