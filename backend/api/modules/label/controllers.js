const labelSchema = require('./model');
const httpStatus = require('http-status');

const createLabel = async (req, res) => {
  try {
    const label = await labelSchema.create(req.body);
    res.status(httpStatus.CREATED).json(label);
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).json(error);
  }
};
const editLabel = async (req, res) => {
  try {
    const label = await labelSchema.findById(req.body.id);
    for (const field in req.body) label[field] = req.body[field];
    res.status(httpStatus.OK).json(await label.save());
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).json(error);
  }
};
const deleteLabel = async (req, res) => {
  try {
    const label = await labelSchema.findById(req.body.id);
    if (!label) return res.status(httpStatus.NOT_FOUND).send();
    await label.remove();
    res.status(httpStatus.OK).send();
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).json(error);
  }
};

const getLabels = async (req, res) => {
  try {
    const { filter = {}, limit = 0, skip = 0 } = req.body;
    const labels = await labelSchema.find(filter, null, { limit, skip });
    res.status(httpStatus.OK).json(labels);
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).json(error);
  }
};
const getLabelById = async (req, res) => {
  try {
    const label = await labelSchema.findById(req.params.id);
    res.status(httpStatus.OK).json(label);
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
  createLabel,
  editLabel,
  deleteLabel,
  getLabels,
  getLabelById,
};
