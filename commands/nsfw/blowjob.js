const Discord = require('discord.js')
const request = require('node-superfetch')

module.exports = {
	name: 'blowjob',
	description: '',
	async execute(client, message, args) {
    if(message.author.id !== client.config.admin1) return
    const {body} = await request.get('https://nekos.life/api/v2/img/bj')
    let embed = new Discord.MessageEmbed()
    .setImage(body.url)
    message.channel.send(embed)
  }
}