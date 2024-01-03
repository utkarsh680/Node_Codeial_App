const Comment = require("../models/comment");
const Post = require("../models/post");

module.exports.create = async function (req, res) {
  try {
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
module.exports.destroy = async function (req, res) {
  try {
      const commentId = req.params.id;
      const comment = await Comment.findById(commentId).exec();
      console.log(comment)
    //  .id means converting object id into strings
      if (comment.user == req.user.id) {
          await comment.deleteOne();;
          return res.redirect('back');
      } else {
          return res.redirect('back');
      }
  } catch (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
  }
};