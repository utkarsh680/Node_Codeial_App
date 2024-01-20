const User = require("../models/user");
const fs = require("fs");
const path = require("path");

module.exports.profile = async function (req, res) {
  const user = await User.findById(req.params.id);
  console.log("hello", user);
  return res.render("user_profile", {
    title: "User Profile",
    profile_user: user,
  });
};

// update profile

module.exports.update = async function (req, res) {
  try {
    if (req.user.id === req.params.id) {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      User.uploadedAvatar(req, res, function (err) {
        if (err) {
          console.log("**MulterError", err);
        }
        (user.name = req.user.name), (user.email = req.user.email);

        if (req.file) {
          // Check if the request contains a file (req.file is truthy)
          if (user.avatar) {
            // Check if the user already has an avatar path stored
            const avatarPath = path.join(__dirname, "..", user.avatar);

            // Check if the avatar file actually exists before attempting to delete
            if (fs.existsSync(avatarPath)) {
              fs.unlinkSync(avatarPath);
            }
          }

          // Save the path of the uploaded file into the avatar field in the user object
          user.avatar = User.avatarPath + "/" + req.file.filename;
        } else {
          // Handle the case where no file is present in the request
          console.error("No file uploaded.");

          // You can also send an error response to the client if applicable
          // res.status(400).json({ error: 'No file uploaded.' });

          // Optionally, you can take other actions if needed
        }
        user.save();
        return res.redirect("back");
      });

      // if (!updatedUser) {
      //   // User with the given ID not found
      //   return res.status(404).send("User not found");
      // }

      // return res.redirect("back");
    } else {
      // User is unauthorized
      req.flash("error", "Unauthorized");
      return res.status(401).send("Unauthorized");
    }
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).send("Internal Server Error");
  }
};
//render the
module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
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
    req.flash("error", "Please Match the Password!");
    return res.redirect("back");
  }
  const user = await User.findOne({ email: req.body.email });
  try {
    if (!user) {
      const userCreate = User.create(req.body);
      if (userCreate) {
        req.flash("success", "User created Successfully!");
        return res.redirect("/users/sign-in");
      }
    } else {
      req.flash("error", "User Already exist!");
      return res.redirect("back");
    }
  } catch (err) {
    req.flash("error", " Please try again.");
    console.log("error", err);
  }
};

//sign in and create session for user
module.exports.createSession = async function (req, res) {
  return res.redirect("/");
};
//module.exports.action = function(req, res){}

//for destroy the function
module.exports.destroySession = function (req, res) {
  req.logout(function (err) {
    if (err) {
      return console.log(err);
    }
    req.flash("success", "You have logged out!");
    return res.redirect("/users/sign-in");
  });
};
