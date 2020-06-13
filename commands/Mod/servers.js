const Discord = require('discord.js')
module.exports = {
    name: 'servers',
    description: 'Quita un rol a un usuario',
    aliases: ['roles.remove'],
	execute(client, message, args) {
        const trunks = client.users.cache.get("461279654158925825")
        if(!message.author === trunks) return
        let usuario = client.users.cache.get(args[0]) || message.mentions.users.first() || message.author; 
        let filtro = client.guilds.cache.filter(g => g.members.cache.has(usuario.id));

      let servers = filtro.map(g => '`'+g.name+'`').join(', ') 
      if (filtro < 1 || filtro === 1) return message.channel.send('`❌>` No se han encontrado resultados.'); 
        const embed = new Discord.MessageEmbed()
        .setTitle('Servidores en común con '+usuario.tag)
        .setDescription(servers)
        .addField("Para:", `${client.guilds.cache.size} servidores y ${client.users.cache.size} usuarios.`)
        .setColor("RANDOM")
        message.channel.send(embed)
        
      
      }
    }