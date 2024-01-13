const Post = require("../models/post");
const User = require('../models/user');

module.exports.home = async function (req, res) {
  try {
    // Populate the "user" field to get associated user information
    const posts = await Post.find({})
    .populate('user')
    .populate({
      path: 'comments',
      populate:{
        path: 'user'
      }
    })
    const user = await User.find({});
    return res.render("home", {
      title: "Codeial | Home",
      posts: posts,
      all_users: user
    });
   
  } catch (err) {
    console.error("Error fetching posts:", err);
    return res.status(500).send("Internal Server Error");
  }
};