const Discord = require('discord.js')
const request = require('node-superfetch')
module.exports = {
	name: 'dog',
	description: '',
	async execute(client, message, args) {
    if(!message.member.hasPermission('ATTACH_FILES')) return
    const { body } = await request.get('https://dog.ceo/api/breeds/image/random');
    message.channel.send({files:[
      {
        attachment: body.message
      }
    ]})
	}
};