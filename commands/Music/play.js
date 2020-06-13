const YouTube = require('simple-youtube-api');
const GOOGLE_API_KEY = "AIzaSyDiUAFTalh5zCnHGIDMfdzlMfzPaQQn09k" || "AIzaSyAQuGsJdvv32x1bxSGjjzm6pc-Hh6WkPcs" || "AIzaSyBjF8ySUjU8aY6jUBIvxmDNV8TUAga1rPI" 
const youtube = new YouTube(GOOGLE_API_KEY);
const ytdl = require('ytdl-core')
const Discord = require('discord.js')
const db = require('megadb')
const bsonDB = require('bsondb')
module.exports = {
name: 'play',
description: 'play <song or url>',
aliases: ['p'],
async execute (client, message, args) {
   if(args[0] === "nonoc") args[0] = "https://www.youtube.com/watch?v=Wh7i6A1_h9o"
  if(args.join(' ') === "brave song") args[0] = "https://www.youtube.com/watch?v=_d8lv6YLuGc"
    const searchString = args.slice(0).join(' ');
const url = args[0] ? args[0].replace(/<(.+)>/g, '$1') : '';
  
    const voiceChannel = message.member.voice.channel;
    let SchemaGuild = new bsonDB.Schema({
        server: String,
        modrole: String,
        adminrole: String,
        messagelogs: String,
        voicelogs: String,
        actionslogs: String,
        memberlogs: String,
        serverlogs: String,
        infrlogs: String,
        prefix: String,
        lang: String
            })
        let Model = new bsonDB.Model("server", SchemaGuild)
    Model.findOne((f) => f.server === message.guild.id, async (datos1) => { 
        
              if (!datos1) {
               return  
              } else {
                let langcode = datos1.lang
                if(langcode === "es") {
                    if (!voiceChannel) return message.channel.send('Debes estar en un canal de voz');
                    const permissions = voiceChannel.permissionsFor(message.client.user);
                    if (!permissions.has('CONNECT')) {
                        return message.channel.send('Necesito el permiso para conectarme al canal de voz');
                    }
                    if (!permissions.has('SPEAK')) {
                        return message.channel.send('Necesito el permiso para hablar en el canal de voz');
                    }
                
                    if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
                        const playlist = await youtube.getPlaylist(url);
                        const videos = await playlist.getVideos();
                        for (const video of Object.values(videos)) {
                            const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
                            await client.handleVideo(video2, message, voiceChannel, true); // eslint-disable-line no-await-in-loop
                        }
                        return message.channel.send(`Playlist: **${playlist.title}** fue añadida a la cola`);
                    } else {
                        try {
                            var video = await youtube.getVideo(url);
                        } catch (error) {
                            try {
                                var videos = await youtube.searchVideos(searchString, 1);
                                
                                // eslint-disable-next-line max-depth
                                
                         
                                const videoIndex = parseInt("1");
                                var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
                            } catch (err) {
                                console.error(err);
                                return message.channel.send('No pude obtener resultados');
                            }
                        }
                        
                        return client.handleVideo(video, message, voiceChannel);
                    }
                } else if(langcode === "en") {
                   if (!voiceChannel) return message.channel.send('You are not in a voice channel');
                    const permissions = voiceChannel.permissionsFor(message.client.user);
                    if (!permissions.has('CONNECT')) {
                        return message.channel.send('I need **CONNECT** permission');
                    }
                    if (!permissions.has('SPEAK')) {
                        return message.channel.send('I need **SPEAK** permission');
                    }
                
                    if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
                        const playlist = await youtube.getPlaylist(url);
                        const videos = await playlist.getVideos();
                        for (const video of Object.values(videos)) {
                            const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
                            await client.handleVideo(video2, message, voiceChannel, true); // eslint-disable-line no-await-in-loop
                        }
                        return message.channel.send(`Playlist: **${playlist.title}** fue añadida a la cola`);
                    } else {
                        try {
                            var video = await youtube.getVideo(url);
                        } catch (error) {
                            try {
                                var videos = await youtube.searchVideos(searchString, 1);
                                
                                // eslint-disable-next-line max-depth
                                
                         
                                const videoIndex = parseInt("1");
                                var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
                            } catch (err) {
                                console.error(err);
                                return message.channel.send("I couldn't get results.");
                            }
                        }
                        
                        return client.handleVideo(video, message, voiceChannel);
                    }
                }
              }
            });
     
}
}