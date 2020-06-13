
const Discord = require('discord.js')
module.exports = {
	name: 'jumbo',
        description: 'jumbo <emoji>',
        aliases: ['emoji'],
	execute(client, message, args) {
 
    if (!args[0]) { 
          return;
        };
     
            if (args[0].startsWith("<")) {
              let emojiRegExp = /<a?:[^:]+:(\d+)>/gm   
                let emojiID = emojiRegExp.exec(args[0])[1];
                let gif = args[0].startsWith('<a:') ? true : false  
            message.channel.send({
          
                    files: [
                        {
                            attachment:  `https://cdn.discordapp.com/emojis/${emojiID}.${gif === true ? "gif" : "png"}`,
                            name: "emoji." + `${gif === true ? "gif" : "png"}`
                        }
                    ]
                   
            });
          } else {
           function toCodePoint(unicodeSurrogates, sep) {
    var
      r = [],
      c = 0,
      p = 0,
      i = 0;
    while (i < unicodeSurrogates.length) {
      c = unicodeSurrogates.charCodeAt(i++);
      if (p) {
        r.push((0x10000 + ((p - 0xD800) << 10) + (c - 0xDC00)).toString(16));
        p = 0;
      } else if (0xD800 <= c && c <= 0xDBFF) {
        p = c;
      } else {
        r.push(c.toString(16));
      }
    }
    return r.join(sep || '-');
}
    let emoji = toCodePoint(args[0])

    message.channel.send({
      files: [
          {
              attachment:`https://twemoji.maxcdn.com/v/12.1.3/72x72/${emoji}.png`,
              name: "emoji" + ".png"
          }
      ]
  }) 
          }
            return;
        
       
      }
    }
  
	