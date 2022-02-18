const mongoose = require('mongoose');
const { MONGO_URI } = process.env;

module.exports.connect = async () => {
  const connectedState = [mongoose.STATES.connected];
  isConnected = connectedState.indexOf(mongoose.connection.readyState) !== -1;

  if (!isConnected) {
    mongoose
      .connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log('Successfully connected to database!'))
      .catch((error) => {
        console.log('Database Connection failed. exiting now ...');
        console.log(error);
        process.exit(1);
      });
  }
};
