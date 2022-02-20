const { Schema, model } = require('mongoose');
const slug = require('slug');
const postSchema = require('../post/model');

const labelSchema = new Schema({
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
});

labelSchema.methods = {
  slugify(name) {
    this.slug = slug(name);
  },
};

labelSchema.pre('validate', function (next) {
  this.slugify(this.name);
  next();
});

labelSchema.post('remove', async function (res, next) {
  await postSchema.updateMany(
    { $in: { label: this._id } },
    { $pull: { label: this._id } },
  );

  next();
});

// labelSchema.statics = {};

module.exports = model('Labels', labelSchema, 'Labels');
