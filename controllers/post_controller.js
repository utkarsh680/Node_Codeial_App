const Post = require("../models/post");
const Comment = require("../models/comment");

module.exports.create = async function (req, res) {
  try {
    const post = await Post.create({
      content: req.body.content,
      user: req.user._id,
    });
    req.flash("success", "Post Created Successfully!");
    if (!post) {
      console.log("Error in creating a post");
      return;
    }

    return res.redirect("back");
  } catch (err) {
    console.error("Error in creating a post", err);
    req.flash("error", "Error in creating post!");

  }
};

module.exports.destroy = async function (req, res) {
  try {
    const postId = req.params.id;

    const post = await Post.findById(postId).exec();
    //  .id means converting object id into strings
    if (post.user == req.user.id) {
      await post.deleteOne();
      await Comment.deleteMany({ post: postId }).exec();
      req.flash("success", "Post Deleted Successfully!");
      return res.redirect("back");
    } else {
      req.flash("success", "Error in deleting post!");
      return res.redirect("back");
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};
