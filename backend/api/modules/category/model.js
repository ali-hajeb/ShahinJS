const { Schema, model } = require('mongoose');
const slug = require('slug');
const postSchema = require('../post/model');

const categorySchema = new Schema({
  slug: {
    type: String,
    unique: [true, 'Category slug must be unique!'],
    trim: true,
    required: [true, 'Category slug is required!'],
  },
  name: {
    type: String,
    unique: [true, 'Category name must be unique!'],
    trim: true,
    required: [true, 'Category name is required!'],
  },
  desc: {
    type: String,
    trim: true,
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Categories',
    validate: {
      validator(parent) {
        console.log(
          this._id,
          parent,
          !this._id.equals(parent),
          this.childeren.indexOf(parent) < 0,
          !this._id.equals(parent) && this.childeren.indexOf(parent) < 0,
        );
        return !this._id.equals(parent) && this.childeren.indexOf(parent) < 0;
      },
      message: (props) => `${props.value} is not a valid parent category!`,
    },
  },
  childeren: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Categories',
    },
  ],
});

categorySchema.methods = {
  slugify(name) {
    this.slug = slug(name);
  },
};

categorySchema.pre('validate', function (next) {
  this.slugify(this.name);
  next();
});

categorySchema.pre('save', function (next, opts) {
  console.log('pre', opts, this.parent);
  next();
});

categorySchema.post('save', function (res, next) {
  console.log('post', res, this.parent);
  next();
});

categorySchema.post('remove', async function (res, next) {
  await this.constructor.removeChildFromParent(this.parent, this._id);
  await this.constructor.updateMany(
    { parent: this._id },
    { $unset: { parent: 1 } },
  );
  await postSchema.updateMany(
    { $in: { category: this._id } },
    { $pull: { category: this._id } },
  );

  next();
});

categorySchema.statics = {
  addChildToParent(parentId, childId) {
    return this.findByIdAndUpdate(
      parentId,
      {
        $push: { childeren: childId },
      },
      { new: true },
    );
  },
  removeChildFromParent(parentId, childId) {
    return this.findByIdAndUpdate(
      parentId,
      {
        $pull: { childeren: childId },
      },
      { new: true },
    );
  },
};

module.exports = model('Categories', categorySchema, 'Categories');
