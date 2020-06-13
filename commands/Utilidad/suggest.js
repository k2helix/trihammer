module.exports = {
	name: 'suggest',
        description: 'Añade una sugerencia',
        aliases: ['sugerir', 'sug'],
	execute(client, message, args) {
const { MessageEmbed } = require("discord.js")
const channel = message.guild.channels.cache.find(c => c.name === "sugerencias");
if(!channel) return;
let reason = args.slice(2).join(' ');
if(!reason) reason = "No se ha proporcionado ninguna razón."
      
      async function accept(key){
    const msg = channel.messages.fetch({limit: 100}).then(async msg => { 
      const filter = await msg.filter(e => e.embeds.length > 0)
      
     const m = filter.find(x => x.embeds[0].footer.text.startsWith(key))
       if (m){ 
        const embed = new MessageEmbed(m.embeds[0])
        .setColor('GREEN')
        .addField(`Ha sido aceptado por la siguiente razón:`, `${reason}`)
        .setFooter(`${key} || Aceptado por ${message.author.tag}`)
        m.edit(embed)
        if (reason !== "No se ha proporcionado ninguna razón."){
            message.author.send(`Tu sugerencia (${key}) ha sido aceptada por: ${reason}`)
            }
       }
    });
      }
    
        async function deny(key, reason = undefined){
      channel.messages.fetch({limit: 100}).then(async (msg) => {
    const filter = await msg.filter(e => e.embeds.length > 0)
      
     const m = filter.find(x => x.embeds[0].footer.text.startsWith(key))
       
        if (m){ 
            let reason = args.slice(2).join(' ');
            if(!reason) reason = "No se ha proporcionado ninguna razón."
        const embed = new MessageEmbed(m.embeds[0])
        .setColor('RED')
        .addField(`Ha sido denegado por la siguiente razón:`, `${reason}`)
        .setFooter(`${key} || Denegado por ${message.author.tag}`)
        m.edit(embed)
        if (reason !== "No se ha proporcionado ninguna razón."){
          message.author.send(`Tu sugerencia (${key}) ha sido denegada por: ${reason}`)
          }
        }
      });
    }
    

        if (args[0] === "accept") {
            accept(args[1])
        return } 
        if (args[0] === "deny") {
            deny(args[1])
        return } else {
        let sMessage = args.join(' ');
        const embed = new MessageEmbed()
        .setColor("#D5BC20")
        .setAuthor(`Pedido por ${message.author.tag}`, message.author.displayAvatarURL({dynamic: true}))
        .setDescription(`**Sugiere:**\n${sMessage}`)
        .setFooter(`${(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)).slice(0, 6)}`)
        channel.send(embed).then(m => {
         m.react("✅")
         m.react("❌")
        })
        }
       
	}
};