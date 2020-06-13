const Discord = require('discord.js')
const request = require('node-superfetch')
module.exports = {
	name: 'cat',
	description: '',
	async execute(client, message, args) {
    if(!message.member.hasPermission('ATTACH_FILES')) return
    const { body } = await request.get('https://aws.random.cat/meow');
    message.channel.send({files:[
      {
        attachment: body.file
      }
    ]})
	}
};