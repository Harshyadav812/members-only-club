const { Router } = require("express");
const indexRouter = Router();
const indexController = require("../controllers/indexController");
const singupValidation = require("../validators/userValidators");
const passport = require("passport");

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}


indexRouter.get("/", indexController.homepage);

// Auth routes
indexRouter.get("/signup", indexController.signup_get);
indexRouter.post("/signup", singupValidation, indexController.signup_post);
indexRouter.get("/login", indexController.login_get);
indexRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/posts",
  failureRedirect: "/login",
  failureFlash: true
}));

indexRouter.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

indexRouter.get("/member", ensureAuthenticated, indexController.becomeMember_get);
indexRouter.post("/member", ensureAuthenticated, indexController.becomeMember_post);

module.exports = indexRouter;