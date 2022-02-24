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
    const comment = await commentSchema.findByIdAndUpdate(
      req.body.id,
      { ...req.body, status: 'PROCESSING' },
      { new: true },
    );
    res.status(httpStatus.OK).json(comment);
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).json(error);
  }
};
const deleteComment = async (req, res) => {
  try {
    const comment = await commentSchema.findById(req.body.id);
    await comment.remove();
    res.status(httpStatus.OK).send();
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).json(error);
  }
};

const getComments = async (req, res) => {
  try {
    const { filter = {}, limit = '*', skip = 0 } = req.body;
    const comment = await commentSchema.find({ filter, limit, skip });
    comment
      ? res.status(httpStatus.OK).json(comment)
      : res.status(httpStatus.NOT_FOUND);
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).json(error);
  }
};

const changeCommentStatus = async (req, res) => {
  try {
    const comment = await commentSchema.findById(req.body.id);
    const updatedComment = await comment.setCommentStatus(req.body.status);
    if (req.body.status === 'APPROVED') await comment.addCommentToPost();
    else if (req.body.status === 'DELETED') {
      await comment.remove();
    } else await comment.removeCommentFromPost();

    res.status(httpStatus.OK).json(updatedComment);
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).json(error);
  }
};

module.exports = {
  writeComment,
  editComment,
  deleteComment,
  getComments,
  changeCommentStatus,
};
