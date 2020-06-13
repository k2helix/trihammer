
const Discord = require('discord.js')
function getMemoryUsage() {
  let total_rss = require('fs').readFileSync("/sys/fs/cgroup/memory/memory.stat", "utf8").split("\n").filter(l => l.startsWith("total_rss"))[0].split(" ")[1]; 
  return Math.round( Number(total_rss) / 1e6 ) - 60;
}
getMemoryUsage()
module.exports = {
	name: 'botinfo',
	description: '',
	async execute(client, message, args) {
if(message.author.id !== client.config.admin1) return
var diskfree = require('diskfree');
diskfree.check('./', function onDiskInfo(error, result) {
    if (error) {
        // You can see if its a known error
        if (diskfree.isErrBadPath(error)) {
            throw new Error('Path is Wrong');
        } else if (diskfree.isErrDenied(error)) {
            throw new Error('Permission Denied');
        } else if (diskfree.isErrIO(error)) {
            throw new Error('IO Error');
        }
 
        throw new Error('Unknown error: ' + error);
    }
  
  let porcentaje = Math.floor(result.used / result.total * 100)

  let embed = new Discord.MessageEmbed()
.setTitle(client.user.tag)
.setThumbnail(client.user.displayAvatarURL())
.setDescription(`Sirviendo a ${client.users.cache.size} usuarios en ${client.guilds.cache.size}`)
.setColor('RANDOM')
.addField('RAM', `${getMemoryUsage()}/512 MB (${Math.floor(getMemoryUsage()/512 * 100)}%)`)
.addField('DISK', `${Math.floor(porcentaje * 199 / 100)}/199 MB (${porcentaje}%)`)
.addField('UPTIME', client.T_convertor(client.uptime))
.setFooter('V1.2.1')
  message.channel.send(embed)
  
});

    

	}
};