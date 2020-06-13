const Discord = require('discord.js');
module.exports = {
	name: '8ball',
	description: 'Hecho para mi padre que siempre duda.',
	execute(client, message, args) {
        if (!args[0]) return 
        let answers = ["No lol", "Claro que sí bro", "Me parece correcto", "Totalmente de acuerdo", "Definitivamente no.", "Deberías hacer lo que quieras, estoy de tu lado, y solo del tuyo.", "Los espíritus menores dicen que no."]
        let question = args.join(" ")
        message.channel.send(answers[Math.floor(Math.random() * answers.length)])
       }
}
