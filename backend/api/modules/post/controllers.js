const postSchema = require('./model');
const userSchema = require('../user/model');
const httpStatus = require('http-status');

const addPost = async (req, res) => {
  try {
    const post = await postSchema.createPost(req.body, req.user._id);
    return res.status(httpStatus.CREATED).json(post);
  } catch (error) {
    console.log(error);
    return res.status(httpStatus.BAD_REQUEST).json(error);
  }
};
// const getPostById = async (req, res) => {
//   try {
//     const post = await postSchema.findById(req.params.id).populate('author');
//     res.status(httpStatus.OK).json(post);
//   } catch (error) {
//     console.log(error);
//     return res.status(httpStatus.BAD_REQUEST).json(error);
//   }
// };
// const getPostBySlug = async (req, res) => {
//   try {
//     const post = await postSchema
//       .findOne({ slug: req.params.slug })
//       .populate('author');
//     res.status(httpStatus.OK).json(post);
//   } catch (error) {
//     console.log(error);
//     return res.status(httpStatus.BAD_REQUEST).json(error);
//   }
// };
// const getPosts = async (req, res) => {
//   try {
//     const { skip = 0, limit = 0 } = req.query;
//     const posts = await postSchema.list({
//       skip: parseInt(skip),
//       limit: parseInt(limit),
//     });
//     res.status(httpStatus.OK).json(posts);
//   } catch (error) {
//     console.log(error);
//     return res.status(httpStatus.BAD_REQUEST).json(error);
//   }
// };

const getPosts = async (req, res) => {
  try {
    const { filter = {}, limit = 0, skip = 0, incView = false } = req.body;
    postSchema
      .find(
        filter,
        null,
        {
          limit,
          skip,
          sort: { createdAt: -1 },
        },
        async (err, docs) => {
          if (err) return res.status(httpStatus.BAD_REQUEST).json(err);
          else if (incView && docs.length === 1) {
            docs[0].views += 1;
            return res.status(httpStatus.OK).json(await docs[0].save());
          } else res.status(httpStatus.OK).json(docs);
        },
      )
      .populate('author')
      .populate('category')
      .populate('label')
      .populate('comments');
  } catch (error) {
    console.log(error);
    return res.status(httpStatus.BAD_REQUEST).json(error);
  }
};

const editPost = async (req, res) => {
  try {
    const post = await postSchema.findById(req.body.id);
    if (!post) return res.status(httpStatus.NOT_FOUND).send();
    else if (!post.author.equals(req.user._id))
      return res.status(httpStatus.UNAUTHORIZED).send();
    for (const field in req.body) {
      post[field] = req.body[field];
    }
    return res.status(httpStatus.OK).json(await post.save());
  } catch (error) {
    console.log(error);
    return res.status(httpStatus.BAD_REQUEST).json({ message: 'Task failed!' });
  }
};
const deletePost = async (req, res) => {
  try {
    const post = await postSchema.findById(req.body.id);
    if (!post) return res.sendStatus(httpStatus.NOT_FOUND).send();
    if (!post.author.equals(req.user._id)) {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    await post.remove();
    return res.sendStatus(httpStatus.OK);
  } catch (error) {
    console.log(error);
    return res.status(httpStatus.BAD_REQUEST).json({ message: 'Task failed!' });
  }
};
const like = async (req, res) => {
  try {
    const user = await userSchema.findById(req.user._id);
    await user.likePost(req.body.id);
    return res.status(httpStatus.OK).send();
  } catch (error) {
    console.log(error);
    return res.status(httpStatus.BAD_REQUEST).json(error);
  }
};
const share = async (req, res) => {
  try {
    const updatedPost = await postSchema.findByIdAndUpdate(
      req.body.id,
      {
        $inc: { shares: 1 },
      },
      { new: true },
    );
    res.status(httpStatus.OK).json(updatedPost);
  } catch (error) {
    console.log(error);
    return res.status(httpStatus.BAD_REQUEST).json(error);
  }
};
const comment = async (req, res) => {};
const hidePost = async (req, res) => {};

module.exports = {
  addPost,
  // getPostBySlug,
  // getPostById,
  getPosts,
  editPost,
  deletePost,
  like,
  share,
  comment,
  hidePost,
};
