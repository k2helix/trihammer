module.exports = async (client) => {
  console.log(
    `el bot ha sido iniciado para ${client.guilds.cache.size} servidores y ${client.users.cache.size} usuarios`
  );
  
  
        
  setInterval(() => {
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
  if(porcentaje > 60) {
     const cp = require('child_process');
const job = cp.exec('git prune');
job.stdout.on('data', (data) => {
  console.log(`stdout (git prune): ${data}`);
});

job.stderr.on('data', (data) => {
  console.log(`stderr (git prune): ${data}`);
});

job.on('close', (code) => {
  console.log(`child process (git prune) exited with code ${code}`);
});
    setTimeout(() => {
const job2 = cp.exec('git gc');
job2.stdout.on('data', (data) => {
  console.log(`stdout (git gc): ${data}`);
});

job2.stderr.on('data', (data) => {
  console.log(`stderr (git gc): ${data}`);
});

job2.on('close', (code) => {
  console.log(`child process (git gc) exited with code ${code}`);
});
      
    }, 5000)
     }
  });
    
    let date = Date.now();
    const db = require("quick.db");
    const remindersDB = new db.table("reminders");
    const mutesDB = new db.table("mutefinalmenteacabado");
    const tempbansDB = new db.table("tempbans");
    for (let reminder of remindersDB.all()) {
      reminder = JSON.parse(reminder.data);
      if (date < reminder.expirationDate) continue;
      if (reminder.notified) continue;
      reminder.notified = true;
      remindersDB.set(`${reminder.expirationDate}`, reminder);
      let user = client.users.cache.get(reminder.user);
      if (!user) continue;
      user.send(`:alarm_clock: **Recordatorio:** ${reminder.content}`);
    }
    for (let mute of mutesDB.all()) {
      mute = JSON.parse(mute.data);

      let server = client.guilds.cache.get(mute.server);
      let user = server.members.cache.get(mute.user);
      if (!user) continue;

      let Muted = server.roles.cache.find(mute => mute.name.toLowerCase() === "trimuted");
      if(!Muted) continue;
      if (!user.roles.cache.has(Muted.id)) {
        mutesDB.set(`${mute.key}`, {
          expirationDate: mute.expirationDate,
          user: mute.user,
          server: mute.server,
          key: mute.key,
          notified: true
        });
        if (mute.expirationDate === "indefinido") continue;
        if (mute.notified === true) continue;
      }
      if (date < mute.expirationDate) continue;

      if (mute.expirationDate !== "indefinido") {
        if(mute.notified === true) continue;
        mute.notified = true;
        mutesDB.set(`${mute.key}`, mute);
        user.roles.remove(Muted.id);
      }
    }
    for (let tempban of tempbansDB.all()) {
      tempban = JSON.parse(tempban.data);
      let server = client.guilds.cache.get(tempban.server);
      if(!server) continue
      client.users.fetch(tempban.user).then(async usuario => {
        let banusers = await server.fetchBans();
        if (!banusers.has(usuario.id)) {
         return tempbansDB.set(`${tempban.key}`, {
            expirationDate: tempban.expirationDate,
            user: tempban.user,
            server: tempban.server,
            key: tempban.key,
            notified: true
          });
        }
        if (date < tempban.expirationDate) return;
          if (tempban.notified) return;
          tempban.notified = true;
          tempbansDB.set(`${tempban.key}`, tempban);
          server.members.unban(usuario.id);
      });
      
    }
  }, 30000);
  let actividades = [
    ["my soul", "WATCHING"],
    ["your beats", "LISTENING"],
    ["nonoc", "LISTENING"],
    ["Styx Helix", "LISTENING"],
    ["Redo", "LISTENING"],
    ["Stay Alive", "LISTENING"],
    ["Paradisus-Paradoxum", "LISTENING"],
    ["yo tengo un moco", "LISTENING"]
  ];

  let status = Math.floor(Math.random() * actividades.length);
  client.user.setPresence({
    status: "online",
    activity: {
      name: actividades[status][0],
      type: actividades[status][1]
    }
  });
}