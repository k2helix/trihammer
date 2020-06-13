module.exports = {
	name: 'say',
        description: 'Haz que el bot diga algo',
        aliases: ['decir'],
	execute(client, message, args) {
        let sMessage = args.join(' ');
    if(!sMessage) return
        if (message.content.toLowerCase().includes("@everyone")) return (message.channel.send("You tried"))
        if (message.content.toLowerCase().includes("@here")) return (message.channel.send("You tried"))
      
        message.delete().catch(O_o=>{});
        message.channel.send(sMessage);
	}
};