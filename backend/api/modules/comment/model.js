const { Schema, model } = require('mongoose');
const postSchema = require('../post/model');
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
    postId: { type: Schema.Types.ObjectId, ref: 'Posts', required: true },
    repliedTo: {
      type: Schema.Types.ObjectId,
      ref: 'Comments',
    },
    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comments',
      },
    ],
  },
  { timestamps: true },
);

commentSchema.post('save', function (err, doc, next) {
  if (err)
    return next({
      status: httpStatus.BAD_REQUEST,
      err,
    });

  this.addCommentToPost();
  next();
});

commentSchema.post('remove', function (res, next) {
  this.removeCommentFromPost();
  next();
});

commentSchema.methods = {
  async setCommentStatus(status = 'PROCESSING' || 'APPROVED' || 'DELETED') {
    await this.updateOne({ status });
  },
  addCommentToPost() {
    return postSchema.findByIdAndUpdate(
      this.postId,
      { $push: { comments: this._id } },
      { new: true },
    );
  },
  removeCommentFromPost() {
    return postSchema.findByIdAndUpdate(
      this.postId,
      { $pull: { comments: this._id } },
      { new: true },
    );
  },
};

commentSchema.statics = {
  addCommentToPost(commentId, postId) {},
  removeCommentFromPost(commentId, postId) {},
};

module.exports = model('Comments', commentSchema, 'Comments');
