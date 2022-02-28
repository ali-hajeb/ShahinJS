const { Schema, model } = require('mongoose');

const statisticsSchema = new Schema(
  {
    year: Number,
    month: Number,
    day: Number,
    views: { count: Number, _all: Number },
    shares: { count: Number, _all: Number },
  },
  { timestamps: true },
);

statisticsSchema.statics = {
  async getStats(...args) {
    const [filter, limit, skip] = args;
    return await this.find(filter, null, { limit, skip });
  },
  async insertStat(doc) {
    return await this.create(doc);
  },
};

module.exports = model('Statistics', statisticsSchema, 'Statistics');
