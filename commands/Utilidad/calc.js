const math = require('mathjs')
const Discord = require('discord.js')
module.exports = {
	name: 'calc',
    description: 'Calcula algo.',
    aliases: ['calcular', 'calculadora', 'calculator', 'calcula', 'calcul'],
	execute(client, message, args) {
        if(!args[0]) return 
        if (message.content.toLowerCase().includes("ella")) return (message.channel.send("Error: Ella no te ama"))
        if (message.content.toLowerCase().includes("yo")) return (message.channel.send("Error: Todo cálculo en el que aparezcas dará error, porque no eres compatible con nadie ni nada"))
        if (message.content.toLowerCase().includes("mi novia")) return (message.channel.send("Error: No tienes novia"))
        let resp;
        try {
            resp = math.evaluate(args.join(' '));
        }
        catch (e) {
            return
        }
        if(resp === Infinity) resp = ":ok_hand:"
        message.channel.send(resp)
       
	}
};