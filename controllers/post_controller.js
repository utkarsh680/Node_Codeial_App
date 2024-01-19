const Post = require("../models/post");
const Comment = require("../models/comment");

module.exports.create = async function (req, res) {
  try {
    const userId = req.user ? req.user._id : null
    const post = await Post.create({
      content: req.body.content,
      user: userId,
    });
    if(req.xhr){
      return res.status(200).json({
        data : {
          post:post
        },
        message: "Post created!"
      });
    }
    
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

      if (req.xhr){
        return res.status(200).json({
          data: {
            post_id: req.params.id
          },
          message: 'Post Deleted'
        })
      }
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
