const schedule = require('node-schedule');
const db = require('../config/database');
const statisticsSchema = require('../modules/statistics/model');
const postSchema = require('../modules/post/model');

const statsDailyTask = schedule.scheduleJob(
  'statsDailyTask',
  {
    dayOfWeek: new schedule.Range(0, 6),
    hour: new schedule.Range(0, 23),
    minute: new schedule.Range(0, 59),
    second: 30,
    tz: 'Asia/Tehran',
  },
  async () => {
    if (db.isConnected()) {
      const stats = await statisticsSchema
        .findOne()
        .sort({ field: 'asc', _id: -1 })
        .limit(1);
      console.log(stats);
      const postData = await postSchema.aggregate([
        {
          $group: {
            _id: null,
            totalViews: { $sum: '$views' },
            totalShares: { $sum: '$shares' },
          },
        },
      ]);
      console.log(postData);
      const date = new Date();
      const newStats = {
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getDate(),
        views: {
          count: stats
            ? parseInt(postData[0].totalViews) - parseInt(stats.views._all)
            : parseInt(postData[0].totalViews),
          _all: parseInt(postData[0].totalViews),
        },
        shares: {
          count: stats
            ? parseInt(postData[0].totalShares) - parseInt(stats.shares._all)
            : parseInt(postData[0].totalShares),
          _all: parseInt(postData[0].totalShares),
        },
      };
      console.log(newStats);
      const doc = await statisticsSchema.insertStat(newStats);
      console.log(doc);
    }
  },
);

// const statsDailyTask = schedule.scheduleJob(
//   'test',
//   '*/10 * * * * *',
//   async () => {
//     console.log('testing scheduling!');
//   },
// );

module.exports = {
  statsDailyTask,
};
