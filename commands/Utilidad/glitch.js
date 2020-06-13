const Discord = require('discord.js')
const Canvas = require('canvas')
const fs = require('fs')
const db = require('megadb')
const bsonDB = require("bsondb");
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const glitch = require('glitch-canvas')



module.exports = {
	name: 'glitch',
	description: '',
	async execute(client, message, args) {
     let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
		let image = user.user.displayAvatarURL({format: 'jpeg', size: 1024})
    let attachments = message.attachments.array()
    if(attachments[0]) image = attachments[0].url
   			const { body } = await request.get(image);
			const data = await loadImage(body);
			const canvas = createCanvas(data.width < 250 ? 278 : data.width, data.height < 250 ? 278 : data.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(data, 0, 0, canvas.width, canvas.height);
			const attachment = canvas.toBuffer();
		  glitch({ seed: Math.floor(Math.random() * 20), itinerations: Math.floor(Math.random() * 20), amount: Math.floor(Math.random() * 20)})
        .fromBuffer( attachment )
        .toBuffer()
        .then( function ( glitchedBuffer ) {
         message.channel.send({
           files: [{
             attachment: glitchedBuffer,
             name: 'glitch.jpeg'
           }]
                   
                   
         })
      }).catch(error => {
        message.channel.send('Please, use the command another time. ' + error)
      })
			
        
    }
}