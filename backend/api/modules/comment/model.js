const { Schema, model } = require('mongoose');
const validator = require('validator');

const commentSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required!'],
      trim: true,
      validate: {
        validator(email) {
          return validator.isEmail(email);
        },
        message: '{VALUE} is not a valid email!',
      },
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['PROCESSING', 'APPROVED', 'DELETED'],
      required: true,
      default: 'PROCESSING',
    },
  },
  { timestamps: true },
);

module.exports = model('Comments', commentSchema, 'Comments');
