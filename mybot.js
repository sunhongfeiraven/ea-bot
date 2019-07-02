const { Wechaty } = require('wechaty');
const { FileBox } = require('file-box');
const qrTerm = require('qrcode-terminal');
const autoText = require('./autoText.js');

const roomRegex = /^Evil Altar*/;

let eaRoom = {};

const handleScan = (qrcode, status) => {
  qrTerm.generate(qrcode, { small: true }); // show qrcode on console
  console.log(
    `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
      qrcode
    )}`
  );
};

const handleLogin = user => {
  console.log(`${user} login`);
};

const handleLogout = user => {
  console.log(`${user} logout`);
};

const handleError = e => {
  console.error(e);
};

const handleMessage = async msg => {
  const contact = msg.from();
  const text = msg.text();
  const room = msg.room();
  if (!room) return;
  if (room.id !== eaRoom.id) return;
  if (await msg.mentionSelf()) {
    await msg.say(`自动回复: 别@我,有事@法神`);
  }
  const main = async () => {
    const current = autoText.find(item => item.key === text);
    if (!current) return;
    if (current.callback) {
      await current.callback(room, msg);
    }
    if (current.text) {
      if (typeof current.text == 'function') {
        await msg.say(`自动回复: ${current.text()}`);
      } else {
        await msg.say(`自动回复: ${current.text}`);
      }
    }
    if (current.file) {
      const fileBox = fileBox(current.file);
      await msg.say(fileBox);
    }
  };
  await main();
};

const main = async () => {
  const bot = new Wechaty({ name: 'ea-bot' });
  bot.on('scan', handleScan);
  bot.on('login', handleLogin);
  bot.on('logout', handleLogout);
  bot.on('error', handleError);
  bot.on('message', handleMessage);
  await bot.start();

  const searchTopic = process.argv[2];

  // wait the bot for logging in
  while (!bot.logonoff()) {
    await new Promise(r => setTimeout(r, 100));
  }

  const room = await bot.Room.find({ topic: roomRegex });

  if (room) {
    const { id } = room;
    eaRoom = { id };
    const topic = await room.topic();
    console.log(`room topic is : ${topic}`);
  }
};

main().catch(e => {
  console.error(e);
  process.exit(1);
});
