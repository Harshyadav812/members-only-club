const path = require("node:path");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const initializePassport = require("./config/passport");
const indexRouter = require("./routes/indexRouter");
const postRouter = require("./routes/postRouter");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Session
app.use(session({
  secret: process.env.secret,
  resave: false,
  saveUninitialized: false
}));

app.use(flash());
// Passport
initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/", indexRouter);
app.use("/posts", postRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
