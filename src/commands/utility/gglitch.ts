// const request = require('node-superfetch');
// const Discord = require('discord.js')
// var getPixels = require('get-pixels-frame-info-update');
// const GIFEncoder = require('gif-encoder-2')
// const { createCanvas, loadImage } = require('canvas');
// var ContentStream = require('contentstream')
// var GifEncoder = require('gif-encoder')
// var jpegJs = require('jpeg-js')
// var PNG = require('pngjs-nozlib').PNG
// var ndarray = require('ndarray')
// var ops = require('ndarray-ops')
// var through = require('through')

import MessageCommand from '../../lib/structures/MessageCommand';
// const glitch = require('glitch-canvas')
import request from 'node-superfetch';
import { AttachmentBuilder, EmbedBuilder } from 'discord.js';
export default new MessageCommand({
	name: 'gglitch',
	description: 'Glitch a gif',
	aliases: ['gifglitch'],
	category: 'image_manipulation',
	required_args: [{ index: 0, name: 'image', type: 'string', optional: true }],
	async execute(client, message, args) {
		let image = message.author.displayAvatarURL({ size: 1024, extension: 'png' });
		let user = message.mentions.users.first() || client.users.cache.get(args[0]);

		if (user) image = user.displayAvatarURL({ extension: 'png', size: 1024 });
		if (args[0] && args[0].startsWith('http')) image = args[0];
		if ([...message.attachments.values()][0]) image = [...message.attachments.values()][0].url;

		let msg = await message.channel.send({ embeds: [client.loadingEmbed()] });
		// @ts-ignore
		let { body } = await request
			.post({
				url: 'https://api.pxlapi.dev/glitch',
				headers: { 'Content-Type': 'application/json', Authorization: 'Application ' + process.env.PXL_API_TOKEN },
				body: JSON.stringify({
					images: [image],
					gif: {}
				})
			})
			.catch((err: Error) => {
				return message.channel.send(err.message);
			});
		const attachment = new AttachmentBuilder(body, { name: 'glitch.gif' });
		message.channel.send({ embeds: [new EmbedBuilder().setColor(3092790).setImage('attachment://glitch.gif')], files: [attachment] });
		msg.delete();
	}
});
// return message.channel.send('Command disabled');
//     let serverConfig = await client.ModelServer.findOne({server: message.guild.id})
//     const langcode = serverConfig.lang
//     let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
//     let image = user.user.displayAvatarURL({ extension: 'jpeg', size: 1024 })
//     let attachments = message.attachments.array()
//     if (attachments[0]) image = attachments[0].url
//     if(user.id === message.member.id && args[0] && args[0].startsWith('http')) image = args[0]
//     if(!image.toLowerCase().includes('.gif')) return message.channel.send(langcode === 'es' ? "Eso no parece un gif, asegúrate de que el archivo sea .gif" : "That doesn't seem like a gif, make sure that the file is .gif")
// const { body, headers } = await request.get(image);
// if(Math.floor(headers['content-length']/1e6) > 3) return message.channel.send(langcode === 'es' ? "El gif es demasiado pesado, tiene que ser inferior a 3MB" : "The gif is heavier than the maximum, it must be lower than 3MB")
// const data = await loadImage(body)
// let width = data.width
// let height = data.height

// function handleData (array, data, frame) {
//   var i, j, ptr = 0, c
//   if (array.shape.length === 4) {
//     return handleData(array.pick(frame), data, 0)
//   } else if (array.shape.length === 3) {
//     if (array.shape[2] === 3) {
//       ops.assign(
//         ndarray(data,
//           [array.shape[0], array.shape[1], 3],
//           [4, 4 * array.shape[0], 1]),
//         array)
//       ops.assigns(
//         ndarray(data,
//           [array.shape[0] * array.shape[1]],
//           [4],
//           3),
//         255)
//     } else if (array.shape[2] === 4) {
//       ops.assign(
//         ndarray(data,
//           [array.shape[0], array.shape[1], 4],
//           [4, array.shape[0] * 4, 1]),
//         array)
//     } else if (array.shape[2] === 1) {
//       ops.assign(
//         ndarray(data,
//           [array.shape[0], array.shape[1], 3],
//           [4, 4 * array.shape[0], 1]),
//         ndarray(array.data,
//           [array.shape[0], array.shape[1], 3],
//           [array.stride[0], array.stride[1], 0],
//           array.offset))
//       ops.assigns(
//         ndarray(data,
//           [array.shape[0] * array.shape[1]],
//           [4],
//           3),
//         255)
//     } else {
//       return new Error('Incompatible array shape')
//     }
//   } else if (array.shape.length === 2) {
//     ops.assign(
//       ndarray(data,
//         [array.shape[0], array.shape[1], 3],
//         [4, 4 * array.shape[0], 1]),
//       ndarray(array.data,
//         [array.shape[0], array.shape[1], 3],
//         [array.stride[0], array.stride[1], 0],
//         array.offset))
//     ops.assigns(
//       ndarray(data,
//         [array.shape[0] * array.shape[1]],
//         [4],
//         3),
//       255)
//   } else {
//     return new Error('Incompatible array shape')
//   }
//   return data
// }
// function haderror (err) {
//   var result = through()
//   result.emit('error', err)
//   return result
// }
// function savePixels (array, type, options) {
//   options = options || {}
//   switch (type.toUpperCase()) {
//     case 'JPG':
//     case '.JPG':
//     case 'JPEG':
//     case '.JPEG':
//     case 'JPE':
//     case '.JPE':
//       var width = array.shape[0]
//       var height = array.shape[1]
//       var data = new Buffer(width * height * 4)
//       data = handleData(array, data)
//       var rawImageData = {
//         data: data,
//         width: width,
//         height: height
//       }
//       var jpegImageData = jpegJs.encode(rawImageData, options.quality)
//       return new ContentStream(jpegImageData.data)

//     case 'GIF':
//     case '.GIF':
//       var frames = array.shape.length === 4 ? array.shape[0] : 1
//       var width = array.shape.length === 4 ? array.shape[1] : array.shape[0]
//       var height = array.shape.length === 4 ? array.shape[2] : array.shape[1]
//       var data = new Buffer(width * height * 4)
//       var gif = new GifEncoder(width, height)
//       gif.writeHeader()
//       for (var i = 0; i < frames; i++) {
//         data = handleData(array, data, i)
//         gif.addFrame(data)
//       }
//       gif.finish()
//       return gif

//     case 'PNG':
//     case '.PNG':
//       var png = new PNG({
//         width: array.shape[0],
//         height: array.shape[1]
//       })
//       var data = handleData(array, png.data)
//       if (typeof data === 'Error') return haderror(data)
//       png.data = data
//       return png.pack()

//     case 'CANVAS':
//       var canvas = createCanvas(width,height)
//       var context = canvas.getContext('2d')
//       canvas.width = array.shape[0]
//       canvas.height = array.shape[1]
//       var imageData = context.getImageData(0, 0, canvas.width, canvas.height)
//       var data = imageData.data
//       data = handleData(array, data)
//       if (typeof data === 'Error') return haderror(data)
//       context.putImageData(imageData, 0, 0)
//       return canvas

//     default:
//       return haderror(new Error('Unsupported file type: ' + type))
//   }
// }
// function gifFrames (options, callback) {
//   options = options || {};
//   callback = callback || function () {};

//   var promise;
//   var resolve;
//   var reject;
//   if (typeof Promise === 'function') {
//     promise = new Promise(function (_resolve, _reject) {
//       resolve = function (res) {
//         callback(null, res);
//         _resolve(res);
//       };
//       reject = function (err) {
//         callback(err);
//         _reject(err);
//       };
//     });
//   } else {
//     promise = brokenPromise;
//     resolve = function (res) {
//       callback(null, res);
//     };
//     reject = callback;
//   }

//   var url = options.url;
//   if (!url) {
//     reject(new Error('"url" option is required.'));
//     return promise;
//   }
//   var frames = options.frames;
//   if (!frames && frames !== 0) {
//     reject(new Error('"frames" option is required.'));
//     return promise;
//   }
//   var outputType = options.outputType || 'jpg';
//   var quality = options.quality;
//   var cumulative = options.cumulative;

//   var acceptedFrames = frames === 'all' ? 'all' : new MultiRange(frames);

//   // Necessary to check if we're in Node or the browser until this is fixed:
//   // https://github.com/scijs/get-pixels/issues/33
//   var inputType = typeof window === 'undefined' ? 'image/gif' : '.GIF';
//   getPixels(url, inputType, function (err, pixels, framesInfo) {
//     if (err) {
//       reject(err);
//       return;
//     }
//     if (pixels.shape.length < 4) {
//       reject(new Error('"url" input should be multi-frame GIF.'));
//       return;
//     }
//     var frameData = [];
//     var maxAccumulatedFrame = 0;
//     for (var i = 0; i < pixels.shape[0]; i++) {
//       if (acceptedFrames !== 'all' && !acceptedFrames.has(i)) {
//         continue;
//       }
//       (function (frameIndex) {
//         frameData.push({
//           getImage: function () {
//             if (cumulative && frameIndex > maxAccumulatedFrame) {
//               // for each frame, replace any invisible pixel with
//               // the corresponding pixel from the previous frame (beginning
//               // with the second frame).
//               // to avoid doing too much work at once we only compute the
//               // frames up to and including the requested frame.
//               var lastFrame = pixels.pick(maxAccumulatedFrame);
//               for (var f = maxAccumulatedFrame + 1; f <= frameIndex; f++) {
//                 var frame = pixels.pick(f);
//                 for (var x = 0; x < frame.shape[0]; x++) {
//                   for (var y = 0; y < frame.shape[1]; y++) {
//                     if (frame.get(x, y, 3) === 0) {
//                       // if alpha is fully transparent, use the pixel
//                       // from the last frame
//                       frame.set(x, y, 0, lastFrame.get(x, y, 0));
//                       frame.set(x, y, 1, lastFrame.get(x, y, 1));
//                       frame.set(x, y, 2, lastFrame.get(x, y, 2));
//                       frame.set(x, y, 3, lastFrame.get(x, y, 3));
//                     }
//                   }
//                 }
//                 lastFrame = frame;
//               }
//               maxAccumulatedFrame = frameIndex;
//             }
//             return savePixels(pixels.pick(frameIndex), outputType, {
//               quality: quality
//             });
//           },
//           frameIndex: frameIndex,
//           frameInfo: framesInfo && framesInfo[frameIndex]
//         });
//       })(i);
//     }
//     resolve(frameData);
//   });

//   return promise;
// }
// const cvs = createCanvas(data.width, data.height)
// let msg = await message.channel.send(langcode === 'es' ? "<a:loading:735243076758667275> Procesando..." : '<a:loading:735243076758667275> Processing')
// const encoder = new GIFEncoder(width, height)
// encoder.start()
// gifFrames({ url: image, frames: 'all', outputType: 'canvas' }).then(function (frameData) {
//   frameData.forEach(frame => {
//   let fr = frame.getImage()
//   const ctx = cvs.getContext('2d')
//   ctx.drawImage(fr,0, 0, cvs.width, cvs.height)
//   let imgData = ctx.getImageData(0, 0, cvs.width, cvs.height)
//   let probabilidad = Math.floor(Math.random() * 100)
//   let seed = Math.floor(Math.random() * 20)
//     let itinerations = Math.floor(Math.random() * 20)
//     let amount = Math.floor(Math.random() * 20)
//     let quality = Math.floor(10 + Math.random() * 89)
//     glitch({ seed: seed, itinerations: itinerations, amount: amount, quality: quality })
//       .fromImageData(imgData)
//       .toImageData()
//       .then(function(imageData) {
//       let ctx2 = cvs.getContext('2d')
//       ctx2.putImageData(imageData, 0, 0 );
//       encoder.addFrame(probabilidad < 69 ? ctx2 : ctx)
//       if(frame.frameIndex === frameData[frameData.length - 1].frameIndex) {
//       encoder.finish()
//       const buffer = encoder.out.getData()
//       const attachment = new Discord.AttachmentBuilder(buffer, 'glitch.gif')
//       message.channel.send({ files: [attachment] })
//       msg.delete()
//       }
//       }).catch(error => {
//       if(frame.frameIndex === frameData[frameData.length - 1].frameIndex) {
//       encoder.finish()
//       const buffer = encoder.out.getData()
//       const attachment = new Discord.AttachmentBuilder(buffer, 'glitch.gif')
//       message.channel.send({ files: [attachment] })
//       msg.delete()
//       }
//         console.log(error)
//       })

//   })
// });
