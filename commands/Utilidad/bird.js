const Discord = require('discord.js')
const request = require('node-superfetch')
module.exports = {
	name: 'bird',
	description: '',
	async execute(client, message, args) {
    if(!message.member.hasPermission('ATTACH_FILES')) return
    const { body } = await request
				.get('https://shibe.online/api/birds')
				.query({
					count: 1,
					urls: true,
					httpsUrls: true
				});
    message.channel.send({files:[
      {
        attachment: body[0]
      }
    ]})
	}
};