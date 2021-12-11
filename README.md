# Trihammer

A Discord bot with a lot of commands and now open-sourced!

## Installation

If you want to self host the bot, then edit .env.example with all your credentials and rename it to .env
- First, download the code manually or do it with git: `git clone https://codeberg.org/anonymous_symbiosis/trihammer.git && cd trihammer`
- Now you will have to install the required packages: `npm install --legacy-peer-deps`
- Run it by using `node index.js` or `npm start`

### Notes
- You will find that some things are not working (like the rep or reset commands). This is because the links in these commands are not changable from the .env, so you will have to do it manually.
- If you don't want to use the top.gg api, just remove it from the guildCreate and guildDelete events and from the rep command.
- If you are not using Heroku, you can remove its api key from .env and delete the Procfile file.
- If you want to add more slash commands, edit the commands.js file in the root directory and deploy them with t-deploy. \
I'm a bit lazy and some things are very improvable, I'm conscious

## Issues
If you find any issue, please open an issue and describe it, I'll check what I can do!