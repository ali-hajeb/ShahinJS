const { Schema, model } = require('mongoose');

const menuSchema = new Schema({
  type: {
    type: String,
    enum: ['NAV', 'SIDE', 'FOOT'],
    require: true,
  },
  title: String,
  items: [{ title: String, href: String, className: String, icon: String }],
  visibility: {
    type: Boolean,
    required: true,
    default: true,
  },
});

menuSchema.statics = {};

module.exports = model('Menus', menuSchema, 'Menus');
