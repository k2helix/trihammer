module.exports = {
	name: 'ocr',
	description: 'Optical character recognition',
	ESdesc: 'Reconocimiento de caracteres óptico',
	usage: 'ocr <image or url>',
	example: 'ocr https://cdn.discordapp.com/attachments/487962590887149603/739828257637138573/n02093859_333.jpg',
	aliases: ['image-to-text', 'textify', 'imagetotext'],
	type: 4,
	execute(client, message) {
		return message.channel.send('Command disabled');
		// const serverConfig: Server = await client.ModelServer.findOne({server: message.guild.id})
		// let langcode = serverConfig.lang
		// let image = args[0]
		// let attachments = message.attachments.array()
		// if (attachments[0]) image = attachments[0].url
		// if(!image) return
		// let mensaje = await message.channel.send(langcode === 'es' ? "<a:loading:735243076758667275> Cargando texto..." : "<a:loading:735243076758667275> Loading text...")
		// const { createWorker } = require('tesseract.js')
		// const worker = createWorker()
		// const PSM = require('tesseract.js/src/constants/PSM.js')
		//   await worker.load()
		//   await worker.loadLanguage(langcode === 'es' ? "spa" : "eng")
		//   await worker.initialize(langcode === 'es' ? "spa" : "eng")
		//   await worker.setParameters({
		//     tessedit_pageseg_mode: PSM.AUTO,
		//   })
		//   const { data: { text } } = await worker.recognize(image);
		//   await worker.terminate()
		//   mensaje.delete()
		//   return message.channel.send(text.trim()).catch(err => {
		//     if(err.code == 50006) {
		//         return message.channel.send(langcode === 'es' ? "No pude encontrar texto en esa imagen" : "I couldn't find text in that image")
		//     } else {
		//     console.log(err)
		//     }
		//   })
	}
};
