const moment = require('moment');

const getDuration = () => {
  const releaseDate = moment('2019-08-27');
  const now = moment();
  const duration = releaseDate.diff(now, 'days');
  return duration;
};

module.exports = [
  {
    key: '什么时候开服',
    text: '8月27日'
  },
  {
    key: '公会制度',
    text:
      'https://img.nga.178.com/attachments/mon_201906/25/8iQ5-bum6XkZ5gT3cS1hq-35s.png'
  },
  {
    key: '倒计时',
    text: () => {
      return `距离开服还有${getDuration()}天`;
    },
    callback: async (room) => {
      await room.topic(`Evil Altar - ${getDuration()}天`)
    }
  }
];
