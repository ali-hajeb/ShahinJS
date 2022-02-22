const commentSchema = require('./model');
const httpStatus = require('http-status');

const writeComment = async (req, res) => {
  try {
    const comment = await commentSchema.create(req.body);
    res.status(httpStatus.CREATED).json(comment);
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).json(error);
  }
};
const editComment = async (req, res) => {
  try {
    // const comment = await commentSchema.findById(req.body.id);
    // To be planned
  } catch (error) {}
};
const deleteComment = async (req, res) => {
  try {
  } catch (error) {}
};
const getCommentsByUserId = async (req, res) => {
  try {
  } catch (error) {}
};
const getCommentsByPostId = async (req, res) => {
  try {
    const comment = await commentSchema.find({ postId: req.params.id });
    comment
      ? res.status(httpStatus.OK).json(comment)
      : res.status(httpStatus.NOT_FOUND);
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).json(error);
  }
};
const getCommentById = async (req, res) => {
  try {
    const comment = await commentSchema.findById(req.body.id);
    comment
      ? res.status(httpStatus.OK).json(comment)
      : res.status(httpStatus.NOT_FOUND);
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).json(error);
  }
};

module.exports = {
  writeComment,
  editComment,
  deleteComment,
  getCommentsByUserId,
  getCommentsByPostId,
  getCommentById,
};
