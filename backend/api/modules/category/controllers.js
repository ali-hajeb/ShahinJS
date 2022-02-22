const categorySchema = require('./model');
const httpStatus = require('http-status');

const createCategory = async (req, res) => {
  try {
    const cat = await categorySchema.create(req.body);
    if (req.body.parent)
      await categorySchema.addChildToParent(req.body.parent, cat._id);
    res.status(httpStatus.CREATED).json(cat);
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).json(error);
  }
};
const editCategory = async (req, res) => {
  try {
    console.log(req.body.parent);
    const cat = await categorySchema.findById(req.body.id);
    if (!cat) return res.status(httpStatus.NOT_FOUND).send();
    let _parent = cat.parent;
    console.log(cat);
    for (const field in req.body) cat[field] = req.body[field];
    let updatedCat = await cat.save();
    if (!_parent?.equals(req.body.parent)) {
      await categorySchema.removeChildFromParent(_parent, cat._id);
      if (req.body.parent)
        await categorySchema.addChildToParent(req.body.parent, cat._id);
    }
    if (req.body.removedChilderen)
      await categorySchema.updateMany(
        { _id: { $in: req.body.removedChilderen } },
        { $unset: { parent: 1 } },
      );
    console.log(cat);
    res.status(httpStatus.OK).json(updatedCat);
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).json(error);
  }
};
const deleteCategory = async (req, res) => {
  try {
    const cat = await categorySchema.findById(req.body.id);
    if (!cat) return res.status(httpStatus.NOT_FOUND).send();
    await cat.remove();
    res.status(httpStatus.OK).send();
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).json(error);
  }
};

const getCategories = async (req, res) => {
  try {
    const { filter = {}, limit = '*' } = req.body;
    const cat = await categorySchema.find({ filter, limit });
    res.status(httpStatus.OK).json(cat);
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).json(error);
  }
};

const getCategoryById = async (req, res) => {
  try {
    const cat = await categorySchema.findById(req.params.id);
    res.status(httpStatus.OK).json(cat);
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).json(error);
  }
};

// const function = async (req, res) => {
//   try {

//   } catch (error) {

//   }
// }

module.exports = {
  createCategory,
  editCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
};
