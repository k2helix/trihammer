# Trihammer

A Discord bot with a lot of commands and now open source!

## Installation

If you want to self host the bot, then edit .env.example and config.json.example with all your credentials and configuration and rename them to .env and config.json \
If you want to use the spotify api for music commands, read and follow [this guide](https://github.com/play-dl/play-dl/tree/9d24008a2be6e1d72af9af06fcb072ac5cd99a42/instructions#spotify).

There are commands that use [Suno](https://suno.com) to work. In order to make them usable, `suno_api` must be set to true in `config.json` **and** a suno api server must be running in the same host ([here are the docs to do this](https://suno.gcui.ai/)).

Installation steps:
- First, download the code manually or do it with git: `git clone --recurse-submodules https://github.com/k2helix/trihammer.git && cd trihammer`
- Now you will have to install the required packages: `npm install`. If you get some error when building canvas or discordjs/opus, maybe it has to do with the node version (18 is suggested) or glibc in linux.
- Build typescript code with `tsc` (do `npm install -g typescript` if not found)
- Run it by using `node dist/src/index.js` or `npm start`


### __Credentials__
In order for the bot to work you need special access tokens and api keys found in `.env` or `config.json`. 

**Required credentials**:
- TOKEN: your discord bot token which you can find in the Discord Developer Portal
- MONGO_URI: your MongoDB database uri, which you can get for free on [their site](https://www.mongodb.com/atlas/database)

**Optional credentials**:
- SENTRY_DSN: useful for error debugging, you can get one at https://sentry.io/welcome/. Enable this in the config file
- DBL_API_KEY: if your bot is available on top.gg, by setting this key it will update joined servers when the bot is added/removed from a server. Enable this in the config file
- SAUCENAO_API_KEY: required for the `sauce` command to work
- HEROKU_TOKEN: if your bot is hosted on Heroku and this token is set, the reset command will restart the process (change the url in that command to match your app's name)

### Notes
- If you do not use any of the optional services included in `.env`, you can remove their entries.
- If you want to add more slash commands, edit the commands.ts file in src/interactionCommands and deploy them with t-deploy.

I'm a bit lazy and some things are very improvable, I'm conscious.

## Useful Links
- [Discord Server](https://discord.gg/EjG6XZs)
- [Invite the bot](https://discord.com/oauth2/authorize?client_id=611710846426415107&permissions=8&scope=bot%20applications.commands)

## Issues
If you find any issue, please open an issue and describe it, I'll check what I can do!
