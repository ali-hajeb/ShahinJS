// const statisticsSchema = require('./model');
// const httpStatus = require('http-status');

// const getStats = async (req, res) => {
//   try {
//     const { filter = {}, limit = 0, skip = 0 } = req.body;
//     const stat = await statisticsSchema.find(filter, null, { limit, skip });
//     res.status(httpStatus.OK).json(stat);
//   } catch (error) {
//     console.log(error);
//     res.status(httpStatus.BAD_REQUEST).json(error);
//   }
// };

// module.exports = {
//   getStats,
// };
