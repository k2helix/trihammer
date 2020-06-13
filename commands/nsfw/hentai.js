
const Discord = require('discord.js')
const request = require('node-superfetch')

module.exports = {
	name: 'hentai',
	description: '',
	async execute(client, message, args) {
    if(message.author.id !== client.config.admin1) return
    
    let subreddits = [
  "hentai",
	"ecchi",
	"pantsu",
	"hentai_gif",
	"ahegao",
	"rule34",
	"hentaipetgirls",
	"uncensoredhentai",
	"masturbationhentai",
	"animehandbras",
	"hentaicleavage",
	"sukebei",
	"yurigif",
	"collarhentai",
	"oppai_gif",
	"cumhentai",
	"hentaimini",
	"maidhentai",
	"yuri",
	"futanari",
	"delicioustraps"
    ]
    let array = []
    let rsubreddit = subreddits[Math.floor(Math.random() * subreddits.length)]
   let subreddit = rsubreddit.toLowerCase()
    let icon = null;
		const { body } = await request
			.get(`https://www.reddit.com/r/${subreddit}/hot.json`)
			.query({ limit: 100 });
		
		const posts = body.data.children.forEach(post => {
      if (!post.data) return
			 array.push(post.data.url)
		});
      let embed = new Discord.MessageEmbed() 
      .setImage(array[Math.floor(Math.random() * array.length)])
      message.channel.send(embed)
   

	}
};