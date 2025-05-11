const db = require("../db/queries");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");


exports.homepage = (req, res) => {
  res.render("home",
    { user: req.user }
  );
}

exports.signup_get = (req, res) => {
  res.render("signupForm", {
    errors: [],
    data: {}
  });
};


exports.signup_post = async (req, res) => {
  const errors = validationResult(req);
  const { username, firstName, lastName, password } = req.body;

  if (!errors.isEmpty()) {
    return res.status(400).render('signupForm', {
      errors: errors.array(),
      data: { username, firstName, lastName },
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    await db.createUser(username, firstName, lastName, hashedPassword);
    res.redirect("/login");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
}


exports.login_get = async (req, res) => {
  const errorMessages = req.flash("error");
  res.render("loginForm", {
    errors: errorMessages,
    data: {}
  });
}

exports.becomeMember_get = async (req, res) => {
  res.render("membershipForm",
    { user: req.user }
  );
};

exports.becomeMember_post = async (req, res) => {
  if (req.body.memberCode === process.env.Membership_code) {
    await db.updateMembershipStatus(req.user.id, true)
    console.log("You're a member now");
  }
  res.redirect("/")
}