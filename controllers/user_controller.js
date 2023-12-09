const User = require("../models/user");

module.exports.profile = async function (req, res) {
  return res.render("user_profile", {
    title: "User Profile",
  });
};

//render the
module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
   return  res.redirect("/users/profile");
  }
  return res.render("user_sign_up", {
    title: "Codeial | Sign Up",
  });
};

//render the sign in page
module.exports.signIn = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  return res.render("user_sign_in", {
    title: "Codeial | sign In",
  });
};

// get the sign up data
module.exports.create = async function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    return res.redirect("back");
  }
  const user = await User.findOne({ email: req.body.email });
  try {
    if (!user) {
      const userCreate = User.create(req.body);
      if (userCreate) {
        return res.redirect("/users/sign-in");
      }
    } else {
      return res.redirect("back");
    }
  } catch (err) {
    console.log("error", err);
  }
};

//sign in and create session for user
module.exports.createSession = async function (req, res) {
  return res.redirect("/");
};
//module.exports.action = function(req, res){}


//for destroy the function
module.exports.destroySession = function(req, res){
  req.logout(function(err){
    if(err){
      return console.log(err)
    }
    return res.redirect('/users/sign-in');
  });
  
}