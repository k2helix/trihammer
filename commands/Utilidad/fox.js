const Discord = require('discord.js')
const request = require('node-superfetch')
module.exports = {
	name: 'fox',
	description: '',
	async execute(client, message, args) {
    if(!message.member.hasPermission('ATTACH_FILES')) return
    const { body } = await request.get('https://randomfox.ca/floof/');
    message.channel.send({files:[
      {
        attachment: body.image
      }
    ]})
	}
};