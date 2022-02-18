const { Schema, model } = require('mongoose');
const { hashSync, compareSync } = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;
const passwordReg = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

const adminSchema = new Schema({
  firstName: {
    type: String,
    required: [true, 'Firstname is required!'],
    trim: true,
    default: null,
  },
  lastName: {
    type: String,
    required: [true, 'Lastname is required!'],
    trim: true,
    default: null,
  },
  username: {
    type: String,
    unique: true,
    required: [true, 'username is required!'],
    trim: true,
    default: null,
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required!'],
    trim: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: '{VALUE} is not a valid email!',
    },
    default: null,
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Password must be longer than 6 characters!'],
    validate: {
      validator(password) {
        return passwordReg.test(password);
      },
      message: '{VALUE} is not a valid password!',
    },
  },
});

adminSchema.methods = {
  hashPassword(password) {
    return hashSync(password);
  },
  authenticateUser(password) {
    return compareSync(password, this.password);
  },
  createToken(expiresIn) {
    return jwt.sign(
      {
        _id: this._id,
        isAdmin: true,
      },
      JWT_SECRET,
      { expiresIn },
    );
  },
  toAuthJSON(token) {
    return {
      _id: this._id,
      username: this.username,
      token: `JWT ${token}`,
    };
  },
  toJSON() {
    return {
      _id: this._id,
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.username,
    };
  },
};

adminSchema.pre('save', function (next) {
  if (this.isModified('password'))
    this.password = this.hashPassword(this.password);
  return next();
});

module.exports = model('Admins', adminSchema, 'Admins');
