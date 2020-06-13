const Discord = require('discord.js')
const request = require('node-superfetch')
module.exports = {
	name: 'duck',
	description: '',
	async execute(client, message, args) {
    if(!message.member.hasPermission('ATTACH_FILES')) return
    const { body } = await request.get('https://random-d.uk/api/v1/random');
    message.channel.send({files:[
      {
        attachment: body.url
      }
    ]})
	}
};