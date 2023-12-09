const Comment = require("../models/comment");
const Post = require("../models/post");

module.exports.create = async function (req, res) {
  try {
    console.log("******", req.body);
    const post = await Post.findById(req.body.postId);

    if (post) {
      const comment = await Comment.create({
        content: req.body.content,
        post: req.body.postId,
        user: req.body.userId,
      });
      post.comments.push(comment);
      post.save();

      res.redirect('/');
    }
  } catch (err) {
    console.error("Error in creating a post", err);
  }
};