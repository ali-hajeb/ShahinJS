const { Schema, model } = require('mongoose');
const slug = require('slug');

const postSchema = new Schema(
  {
    slug: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
    },
    title: {
      type: String,
      unique: true,
      trim: true,
      required: [true, 'Post title is required!'],
      default: 'Title',
    },
    body: {
      type: String,
      trim: true,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'Admins',
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      counter: {
        type: Number,
        default: 0,
      },
      users: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Users',
        },
      ],
    },
    shares: {
      type: Number,
      default: 0,
    },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comments' }],
    category: [{ type: Schema.Types.ObjectId, ref: 'Categories' }],
    label: [{ type: Schema.Types.ObjectId, ref: 'Labels' }],
  },
  { timestamps: true },
);

postSchema.methods = {
  slugify(title) {
    this.slug = slug(title);
  },
  toJSON() {
    return {
      _id: this._id,
      title: this.title,
      slug: this.slug,
      body: this.body,
      author: this.author,
      views: this.views,
      likes: this.likes,
      shares: this.shares,
      createdAt: this.createdAt,
      comments: this.comments,
      category: this.category,
      label: this.label,
      hidden: this.hidden,
    };
  },
};

postSchema.pre('validate', function (next) {
  this.slugify(this.title);
  next();
});

postSchema.post('save', function (err, doc, next) {
  if (err.name === 'MongoServerError' && err.code === 11000) {
    return next({
      status: httpStatus.BAD_REQUEST,
      message: 'Duplicated value',
      err,
    });
  }
  next();
});

postSchema.statics = {
  createPost(args, author) {
    return this.create({ ...args, author });
  },
  list({ skip = 0, limit = 0 }) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author');
  },
  like(id, user) {
    return this.findByIdAndUpdate(id, {
      $inc: { 'likes.counter': 1 },
      $push: { 'likes.users': user },
    });
  },
  unLike(id, user) {
    return this.findByIdAndUpdate(id, {
      $inc: { 'likes.counter': -1 },
      $pull: { 'likes.users': user },
    });
  },
};

module.exports = model('Posts', postSchema, 'Posts');
