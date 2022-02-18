const { Schema, Types, model } = require('mongoose');
const validator = require('validator');
const { hashSync, compareSync } = require('bcryptjs');
const jwt = require('jsonwebtoken');
const postSchema = require('../post/model');

const { JWT_SECRET } = process.env;
const passwordReg = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

const userSchema = new Schema({
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
  liked: {
    posts: [
      {
        type: Types.ObjectId,
        ref: 'Posts',
      },
    ],
  },
  comments: [
    {
      type: Types.ObjectId,
      ref: 'Comments',
    },
  ],
});

userSchema.methods = {
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
      },
      JWT_SECRET,
      { expiresIn },
    );
  },
  toAuthJSON(token) {
    return {
      _id: this._id,
      firstName: this.firstName,
      lastName: this.lastName,
      token: `JWT ${token}`,
    };
  },
  toJSON() {
    return {
      _id: this._id,
      firstName: this.firstName,
      lastName: this.lastName,
    };
  },
  async likePost(id) {
    if (this.liked.posts.indexOf(id) > -1) {
      this.liked.posts.remove(id);
      await postSchema.unLike(id, this._id);
    } else {
      this.liked.posts.push(id);
      await postSchema.like(id, this._id);
    }
    return this.save();
  },
};

userSchema.pre('save', function (next) {
  if (this.isModified('password'))
    this.password = this.hashPassword(this.password);
  if (this.isModified('email')) this.email = this.email.toLowerCase();
  return next();
});

module.exports = model('Users', userSchema, 'Users');
