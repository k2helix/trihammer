

//ESTE CODIGO NO AFECTARA SU BOT, SCRIPT DE ARRANQUE

const http = require("http");
const express = require("express");
const app = express();

app.use(express.static("public"));

app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/", (request, response) => {
  response.sendStatus(200);
});

app.listen(process.env.PORT);

setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

//DESDE AQUI EMPIEZA A ESCRIBIR EL CODIGO PARA SU BOT



//DESDE AQUI EMPIEZA A ESCRIBIR EL CODIGO PARA SU BOT
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
const idiomas = new db.crearDB("idiomas");
const spam = require("spamnya");


var guild = {};

const client = new Discord.Client({ disableEveryone: true });
client.commands = new Discord.Collection();
client.queue = new Map();
client.config = require("./config.json");
const token = process.env.TOKEN
const cheerio = require("cheerio");
const request = require("request");
const separateReqPool = { maxSockets: 15 };
const async = require("async");
const _ = require("lodash");
let tweets = {},
  apiurls = [],
  N = [];

///////////////////////////  CONFIGURE TWITTER HANDLERS /////////////////////////////////////////////////////
var THandlers=[
  {
      name:'『Re:ゼロから始める異世界生活』公式',
      url:"https://twitter.com/Rezero_official",
      keywords:"*",
  }
];
/////////////////////////////////////////////////////////////////////////////////////////////////////////////


console.log('Twitter => Discord program is running');


//ADD TWEETS
THandlers.forEach((th,i) => {
  tweets[th.url] = [];
  apiurls.push(th.url);
});


//MONITOR
setInterval(() => {
  async.map(apiurls, function(item, callback){
      request({url: item, pool: separateReqPool}, function (error, response, body) {
          try {
              const $ = cheerio.load(body);
              var turl = "https://twitter.com" + response.req.path;
              if(!tweets[turl].length){
                  //FIRST LOAD
                  for(let i=0;i<$('div.js-tweet-text-container p').length;i++){
                      tweets[turl].push($('div.js-tweet-text-container p').eq(i).text());
                  }
              }
              else{
                  //EVERY OTHER TIME
                  for(let i=0;i<$('div.js-tweet-text-container p').length;i++){
                      const s_tweet = $('div.js-tweet-text-container p').eq(i).text();
                      const l_tweet = `https://twitter.com${$('.js-stream-tweet').eq(i).attr("data-permalink-path")}`;
                      //CHECK IF TWEET IS NEWS
                      if(tweets[turl].indexOf(s_tweet) === -1){
                          tweets[turl].push(s_tweet);
                          let th_kw = THandlers.filter((d,i) => d.url === turl)[0].keywords.split(',');
                          let th_name = THandlers.filter((d,i) => d.url === turl)[0].name;
                          th_kw.forEach((kw,j) => {
                              if(kw === '*'){
                                  N.push({
                                      tweet:s_tweet,
                                      name:th_name,
                                      link:l_tweet
                                  });
                              }
                              else{
                                 if(s_tweet.indexOf(kw) != -1){
                                      N.push({
                                          tweet:s_tweet,
                                          name:th_name,
                                          link:l_tweet
                                      });
                                  }
                              }
                          });
                      }
                  }
              }           
               
          } catch (e) {
                console.log('Error =>' + e);
          }
      });
  }, function(err, results){
          //console.log(results);
  });
},3*1000);//RUNS EVERY 5 SECONDS

setInterval(() => {
  if(N.length){
      let n = N.shift();
      const getImageUrls =require('get-image-urls')
      getImageUrls(`${n.link}/photo/1`, function(err, images) {
  if (!err) {
 let image = images.filter(img => img.url.includes('media'))
 if(!image[0]) image = null
 let embed = new Discord.MessageEmbed()
 .setAuthor(
   n.name,
   "https://cdn.discordapp.com/attachments/487962590887149603/661723693931823104/IMG_20191124_172838.jpg"
 )
 .setTitle("Nuevo Tweet")
 .setDescription(`${image ? n.tweet.slice(0, n.tweet.length - 26) : n.tweet} \n[LINK](${n.link})`)
 .setImage(image ? image[0].url : null)
 .setURL('https://twitter.com/Rezero_official')
 .setColor("RANDOM");
 client.channels.cache.get('714515804372205579').send(embed)
  }
  else {
    console.log('ERROR al obtener la imagen del tweet', err);
  }
})
      
       
  }
},500);

const array = ['Mod', 'xp', 'Music', 'Utilidad', 'Kawai', 'config', 'nsfw']

array.some(arr => {
  const commandFiles = fs
  .readdirSync("./commands/"+arr)
  .filter(file => file.endsWith(".js"));
  for (const file of commandFiles) {
    const command = require(`./commands/${arr}/${file}`);
    client.commands.set(command.name, command);
  }

})


client.convertDate = function(ms) {
  let date = new Date(ms),
    months = {
      0: "Enero",
      1: "Febrero",
      2: "Marzo",
      3: "Abril",
      4: "Mayo",
      5: "Junio",
      6: "Julio",
      7: "Agosto",
      8: "Septiembre",
      9: "Octubre",
      10: "Noviembre",
      11: "Diciembre"
    },
    days = {
      0: "Domingo",
      1: "Lunes",
      2: "Martes",
      3: "Miércoles",
      4: "Jueves",
      5: "Viernes",
      6: "Sábado"
    },
    year = date.getFullYear(),
    month = months[date.getMonth()],
    day = date.getDate(),
    wDay = days[date.getDay()],
    hour = date.getHours(),
    minute = date.getMinutes(),
    second = date.getSeconds();
  if (second < 10) second = "0" + second;
  if (minute < 10) minute = "0" + minute;
  if (hour < 10) hour = "0" + hour;

  return `${wDay} ${day} de ${month} de ${year} - ${hour}:${minute}:${second}`;
};
client.econvertDate = function(ms) {
  let date = new Date(ms),
    months = {
      0: "January",
      1: "February",
      2: "March",
      3: "April",
      4: "May",
      5: "June",
      6: "July",
      7: "August",
      8: "September",
      9: "October",
      10: "November",
      11: "December"
    },
    days = {
      0: "Sunday",
      1: "Monday",
      2: "Tuesday",
      3: "Wednesday",
      4: "Thursday",
      5: "Friday",
      6: "Saturday"
    },
    year = date.getFullYear(),
    month = months[date.getMonth()],
    day = date.getDate(),
    wDay = days[date.getDay()],
    hour = date.getHours(),
    minute = date.getMinutes(),
    second = date.getSeconds();
  if (second < 10) second = "0" + second;
  if (minute < 10) minute = "0" + minute;
  if (hour < 10) hour = "0" + hour;
  if (day > 3 && day != 31) {
    return `${wDay} ${day}th of ${month}, ${year} - ${hour}:${minute}:${second}`;
  }
  if (day == 1) {
    return `${wDay} ${day}st of ${month}, ${year} - ${hour}:${minute}:${second}`;
  }
  if (day == 2) {
    return `${wDay} ${day}nd of ${month}, ${year} - ${hour}:${minute}:${second}`;
  }
  if (day == 3) {
    return `${wDay} ${day}rd of ${month}, ${year} - ${hour}:${minute}:${second}`;
  }
  if (day == 31) {
    return `${wDay} ${day}st of ${month}, ${year} - ${hour}:${minute}:${second}`;
  }
};
client.convertDate2 = function(ms) {
  let date = new Date(ms),
    months = {
      0: "1",
      1: "2",
      2: "3",
      3: "4",
      4: "5",
      5: "6",
      6: "7",
      7: "8",
      8: "9",
      9: "10",
      10: "11",
      11: "12"
    },
    days = {
      0: "Domingo",
      1: "Lunes",
      2: "Martes",
      3: "Miércoles",
      4: "Jueves",
      5: "Viernes",
      6: "Sábado"
    },
    year = date.getFullYear(),
    month = months[date.getMonth()],
    day = date.getDate(),
    wDay = days[date.getDay()],
    hour = date.getHours(),
    minute = date.getMinutes(),
    second = date.getSeconds();
  if (second < 10) second = "0" + second;
  if (minute < 10) minute = "0" + minute;
  if (hour < 10) hour = "0" + hour;

  return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
};

client.mothandday = function(ms) {
  let date = new Date(ms),
    months = {
      0: "1",
      1: "2",
      2: "3",
      3: "4",
      4: "5",
      5: "6",
      6: "7",
      7: "8",
      8: "9",
      9: "10",
      10: "11",
      11: "12"
    },

    year = date.getFullYear(),
    month = months[date.getMonth()],
    day = date.getDate(),
    hour = date.getHours(),
    minute = date.getMinutes(),
    second = date.getSeconds();


  return `${month}/${day}`;
};

client.T_convertor = ms => {
  let años = Math.floor(ms / (1000 * 60 * 60 * 24 * 365));
  let meses = Math.floor(
    (ms % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30)
  );
  let dias = Math.floor(
    (ms % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24)
  );
  let horas = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutos = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  let segundos = Math.floor((ms % (1000 * 60)) / 1000);

  let final1 = "";
  if (años > 0) final1 += años > 1 ? `${años} años, ` : `${años} año, `;
  if (meses > 0) final1 += meses > 1 ? `${meses} meses y ` : `${meses} mes y `;
  if (dias > 0) final1 += dias > 1 ? `${dias} días. ` : `${dias} día. `;
  if (dias < 1 && horas > 0)
    final1 += horas > 1 ? `${horas} horas, ` : `${horas} hora, `;
  if (dias < 1 && minutos > 0)
    final1 += minutos > 1 ? `${minutos} minutos y ` : `${minutos} minuto y `;
  if (dias < 1 && segundos > 0)
    final1 += segundos > 1 ? `${segundos} segundos.` : `${segundos} segundo.`;
  return final1;
};
client.eT_convertor = ms => {
  let años = Math.floor(ms / (1000 * 60 * 60 * 24 * 365));
  let meses = Math.floor(
    (ms % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30)
  );
  let dias = Math.floor(
    (ms % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24)
  );
  let horas = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutos = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  let segundos = Math.floor((ms % (1000 * 60)) / 1000);

  let final1 = "";
  if (años > 0) final1 += años > 1 ? `${años} years, ` : `${años} year, `;
  if (meses > 0)
    final1 += meses > 1 ? `${meses} months and ` : `${meses} month and `;
  if (dias > 0) final1 += dias > 1 ? `${dias} days` : `${dias} day`;
  if (dias < 1 && horas > 0)
    final1 += horas > 1 ? `${horas} hours, ` : `${horas} hour, `;
  if (dias < 1 && minutos > 0)
    final1 +=
      minutos > 1 ? `${minutos} minutes and ` : `${minutos} minute and `;
  if (dias < 1 && segundos > 0)
    final1 += segundos > 1 ? `${segundos} seconds` : `${segundos} second`;
  return final1;
};




fs.readdir("./events/", (err, files) => {
  if (err) return console.error;
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    const evt = require(`./events/${file}`);
    let evtName = file.split(".")[0];
    client.on(evtName, evt.bind(null, client));
  });
});

process.on('unhandledRejection', (error, p) => {
  console.log('[ERROR]');
  console.dir(error);
});

client.login(token);
