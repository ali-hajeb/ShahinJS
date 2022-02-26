const menuSchema = require('./model');
const httpStatus = require('http-status');

const addMenu = async (req, res) => {
  try {
    const menu = await menuSchema.create(req.body);
    res.status(httpStatus.OK).json(menu);
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).json(error);
  }
};
const editMenu = async (req, res) => {
  try {
    const menu = await menuSchema.findById(req.body.id);
    for (const field of req.body) menu[field] = req.body[field];
    res.status(httpStatus.OK).json(await menu.save());
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).json(error);
  }
};
const deleteMenu = async (req, res) => {
  try {
    const menu = await menuSchema.findById(req.body.id);
    await menu.remove();
    res.status(httpStatus.OK).send();
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).json(error);
  }
};
const getMenus = async (req, res) => {
  try {
    const { filter = {}, limit = 0, skip = 0 } = req.body;
    const menus = await menuSchema.find(filter, null, {
      limit,
      skip,
    });
    res.status(httpStatus.OK).json(menus);
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).json(error);
  }
};

module.exports = {
  addMenu,
  editMenu,
  deleteMenu,
  getMenus,
};
