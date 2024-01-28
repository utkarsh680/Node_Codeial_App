const Post = require("../../../models/post");
const Comment = require("../../../models/comment");
module.exports.index = async function (req, res) {
  const posts = await Post.find({})
    .sort("-createdAt")
    .populate("user")
    .populate({
      path: "comments",
      populate: {
        path: "user",
      },
    });
  return res.json(200, {
    message: "List of posts",
    posts: posts,
  });
};
module.exports.destroy = async function (req, res) {
  try {
    const postId = req.params.id;
    console.log(postId);
    const post = await Post.findById(postId);
    console.log(post);

    if (!post) {
      return res.json(404, {
        message: 'Post Not Found'
      })
      
    }

    // Check if the logged-in user is the owner of the post
    if (post.user == req.user.id) {
    await post.deleteOne();
    await Comment.deleteMany({ post: postId });

    // Return a JSON response without any argument
   
    return res.json(200, {
      message : "Post and associated comments deleted successfully"
    })
    } else {
      return res.json(401, {
        message : 'You cannot delete this post!'
      })
    }
  } catch (err) {
    console.log("#$222", err);
    return res.json(500, {
      message : "Internal Server Error"
    })
  }
};
