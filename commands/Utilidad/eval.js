const Discord = require('discord.js');



module.exports = {
	name: 'eval',
  description: '',
	async execute(client, message, args) {
        if(message.author.id !== client.config.admin1) return;
        if(message.author.id !== "461279654158925825") return;
        function clean(text) {
            if (typeof(text) === "string")
              return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            else
                return text;
          }
          try {
            const code = args.join(" ");
            let evaled = eval(code);
       
            if (typeof evaled !== "string")
              evaled = require("util").inspect(evaled);
       
            message.channel.send(clean(evaled), {code:"xl"});
          } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
          }


    }
}