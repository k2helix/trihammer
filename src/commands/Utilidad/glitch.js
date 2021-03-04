const request = require('node-superfetch');
const { MessageAttachment } = require('discord.js');
module.exports = {
	name: 'glitch',
	description: 'Glitch an image',
	ESdesc: 'Glitchea una imagen',
	usage: 'glitch [user or image or url] [iterations] [amount]',
	example: 'glitch\nglitch @user 10 23',
	cooldown: 3,
	type: 4,
	myPerms: [true, 'ATTACH_FILES'],
	async execute(client, message, args) {
		let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
		let image = user.displayAvatarURL({ format: 'png', size: 1024 });
		let attachments = message.attachments.array();
		if (attachments[0]) image = attachments[0].url;
		if (user.id === message.member.id && args[0] && args[0].startsWith('http')) image = args[0];
		let iterations;
		let amount;

		switch (user.id) {
			case message.author.id:
				if (!isNaN(args[0]) && !isNaN(args[1])) {
					iterations = Number(args[0]) > 99 ? 99 : Number(args[0]);
					amount = Number(args[1]) > 99 ? 99 : Number(args[1]);
				} else {
					iterations = Math.floor(Math.random() * 20 + 1);
					amount = Math.floor(Math.random() * 30 + 1);
				}
				break;

			case (message.mentions.users.first() || client.users.cache.get(args[0])).id:
				if (!isNaN(args[1]) && !isNaN(args[2])) {
					iterations = Number(args[1]) > 99 ? 99 : Number(args[1]);
					amount = Number(args[2]) > 99 ? 99 : Number(args[2]);
				} else {
					iterations = Math.floor(Math.random() * 20 + 1);
					amount = Math.floor(Math.random() * 30 + 1);
				}
				break;
		}

		let result = await request.post('https://fapi.wrmsr.io/glitch', {
			headers: {
				'Content-Type': 'application/json',
				authorization: 'Bearer ' + '6b32d7c4d4d6fc8813825917ca61e'
			},
			body: JSON.stringify({
				images: [image],
				args: {
					iterations: iterations,
					amount: amount
				}
			})
		});
		const attachment = new MessageAttachment(result.raw, 'glitch.png');
		message.channel.send(`Iterations ${iterations}; Amount ${amount}`, attachment);
	}
};

// const { createCanvas, loadImage } = require('canvas');
// const request = require('node-superfetch');
// const glitch = require('glitch-canvas')

// module.exports = {
//   name: 'glitch',
//   description: 'Glitch an image',
//   ESdesc: 'Glitchea una imagen',
//   usage: 'glitch [user or image or url]',
//   example: 'glitch\nglitch @user',
//   async execute(client, message, args) {
//     let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
//     let image = user.user.displayAvatarURL({ format: 'jpeg', size: 1024 })
//     let attachments = message.attachments.array()
//     if (attachments[0]) image = attachments[0].url
//     if(user.id === message.member.id && args[0] && args[0].startsWith('http')) image = args[0]
//     const { body } = await request.get(image);
//     const data = await loadImage(body);
//     const canvas = createCanvas(data.width < 250 ? 278 : data.width, data.height < 250 ? 278 : data.height);
//     const ctx = canvas.getContext('2d');
//     ctx.drawImage(data, 0, 0, canvas.width, canvas.height);
//     const attachment = canvas.toBuffer();
//     let seed = Math.floor(Math.random() * 20)
//     let itinerations = Math.floor(Math.random() * 20)
//     let amount = Math.floor(Math.random() * 20)
//     let quality = Math.floor(10 + Math.random() * 89)
//     let texto = `Seed ${seed}, ${itinerations} itinerations, ${amount} amount, ${quality} quality`
//     glitch({ seed: seed, itinerations: itinerations, amount: amount, quality: quality })
//       .fromBuffer(attachment)
//       .toBuffer()
//       .then(function(glitchedBuffer) {
//         message.channel.send(texto, {
//           files: [{
//             attachment: glitchedBuffer,
//             name: 'glitch.jpeg'
//           }]

//         })
//       }).catch(error => {
//         message.channel.send(`Please, use the command another time (${texto}). ` + error)
//       })

//   }
// }
