const { Schema, model } = require('mongoose');
const slug = require('slug');
const validator = require('validator');

const engAndNumRegex = /^[a-z][a-z0-9]*$/i;
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
  // name_en: {
  //   type: String,
  //   unique: [true, 'Category slug must be unique!'],
  //   validate: {
  //     validator(name_en) {
  //       return engAndNumRegex.test(name_en);
  //     },
  //     message:
  //       '{VALUE} does not match with the pattern! It must consist of english letters and/or numbers.',
  //   },
  //   trim: true,
  //   // required: [
  //   //   true,
  //   //   'Category name with english letters and/or numbers is required!',
  //   // ],
  // },
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
