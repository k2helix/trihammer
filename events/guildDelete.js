const Discord = require("discord.js");
const fs = require("fs");
const moment = require("moment");

const Canvas = require("canvas");
const ytdl = require("ytdl-core");
const ffmpeg = require("ffmpeg");
const GOOGLE_API_KEY = "AIzaSyBjF8ySUjU8aY6jUBIvxmDNV8TUAga1rPI";
const YouTube = require("simple-youtube-api");
const youtube = new YouTube(GOOGLE_API_KEY);
const db = require("megadb");
const bsonDB = require("bsondb");
const spam = require('spamnya')
module.exports = async (client, guild) => {
   let server = client.channels.cache.get("640548372574371852");
  server.send(`Me he salido del servidor ${guild.name}`);
}