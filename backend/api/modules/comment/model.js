const { Schema, model } = require('mongoose');
const postSchema = require('../post/model');
const validator = require('validator');
const httpStatus = require('http-status');

const commentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
    },
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
  console.log(this.status);
  next();
});

// commentSchema.post(
//   'updateOne',
//   { document: true, query: false },
//   async function () {
//     console.log(this.status);
//     // if (err) return next({ status: httpStatus.BAD_REQUEST, err });
//     if (this.isModified('status')) {
//       console.log(this.status);
//       if (this.status === 'APPROVED') await this.addCommentToPost();
//       else await this.removeCommentFromPost();
//     }
//     // next();
//   },
// );

commentSchema.post('remove', function (res, next) {
  this.removeCommentFromPost();
  next();
});

commentSchema.methods = {
  async setCommentStatus(status = 'PROCESSING' || 'APPROVED' || 'DELETED') {
    return await this.updateOne({ status }, { new: true });
  },
  async addCommentToPost() {
    return await postSchema.findByIdAndUpdate(
      this.postId,
      { $addToSet: { comments: this._id } },
      { new: true },
    );
  },
  async removeCommentFromPost() {
    return await postSchema.findByIdAndUpdate(
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
