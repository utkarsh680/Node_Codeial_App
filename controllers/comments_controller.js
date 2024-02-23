const Comment = require("../models/comment");
const Post = require("../models/post");

module.exports.create = async function (req, res) {
  try {
    const post = await Post.findById(req.body.postId);
  
    const userId = req.user ? req.user._id : null;
    if (post) {
      console.log(req.body.content, req.body.postId, userId)
      const comment = await Comment.create({
        content: req.body.content,
        post: req.body.postId,
        user: userId,
      });     
      await comment.populate("user", "name");
      post.comments.push(comment);
      post.save();
      
      if (req.xhr) {
        return res.status(200).json({
          data: {
            comment: comment,
          },
          message: "Comment created!",
        });
      }
    }
    return res.redirect("back");
  } catch (err) {
    console.error("Error in creating a comment", err);
  }
};
module.exports.destroy = async function (req, res) {
  try {
    const commentId = req.params.id;
    const comment = await Comment.findById(commentId).exec();
    console.log(comment);
    //  .id means converting object id into strings
    if (comment.user == req.user.id) {
      await comment.deleteOne();
      req.flash("success", "Comment Deleted Successfully!");
      return res.redirect("back");
    } else {
      return res.redirect("back");
    }
  } catch (err) {
    console.error(err);
    req.flash("error", "Error in Deleting comment!");
    return res.status(500).send("Internal Server Error");
  }
};
