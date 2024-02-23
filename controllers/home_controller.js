
const Post = require("../models/post");
const User = require('../models/user');

module.exports.redirectToHome = function (request, response) {
  return response.redirect("/home");
};

module.exports.home = async function (req, res) {
  try {
    // Populate the "user" field to get associated user information
    const posts = await Post.find({})
    .sort('-createdAt')
    .populate('user')
    .populate({
      path: 'comments',
      populate:{
        path: 'user'
      }
    })
    console.log(posts);
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