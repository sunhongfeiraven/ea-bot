const { Wechaty } = require('wechaty');
const { FileBox } = require('file-box');
const qrTerm = require('qrcode-terminal');
const autoText = require('./autoText.js');

const bot = new Wechaty({ name: 'ea-bot' });

// const eaRoomID =
//   '@@5bf05729d35be05b847c5eed97319fc0c9fe777dfecb89e54e1f479bfb386794';

const handleScan = (qrcode, status) => {
  qrTerm.generate(qrcode, { small: true }); // show qrcode on console
  console.log(`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrcode)}`);
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

const getAutoReply = message => {
  let result = null;
  const currentTextObj = autoText.find(item => item.key === message);
  if (!currentTextObj) return null;
  if (currentTextObj.file) {
    result = currentTextObj.file;
  } else {
    result = currentTextObj.text;
  }
  return result;
};

const handleMessage = async msg => {
  const contact = msg.from();
  const text = msg.text();
  const room = msg.room();
  if (!room) return;
  // if (room.id !== eaRoomID) return;
  const autoReply = getAutoReply(text);
  if (autoReply) {
    msg.say(`自动回复:${autoReply}`);
  }
};

bot.on('scan', handleScan);
bot.on('login', handleLogin);
bot.on('logout', handleLogout);
bot.on('error', handleError);
bot.on('message', handleMessage);
bot.start();
