const userSchema = require('./model');
const httpStatus = require('http-status');

const login = async (req, res, next) => {
  const expiresIn = req.body.rememberMe ? 7 * 24 * 3600 : 3600;
  const token = req.user.createToken(expiresIn);
  res.status(httpStatus.OK).json(req.user.toAuthJSON(token));
  return next();
};

const signUp = async (req, res) => {
  try {
    const user = await userSchema.create(req.body);
    return res.status(httpStatus.CREATED).json(user);
  } catch (error) {
    console.log(error);
    return res.status(httpStatus.CREATED).json(error);
  }
};

module.exports = {
  login,
  signUp,
};
