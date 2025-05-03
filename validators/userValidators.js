const { body } = require("express-validator");

const singupValidation = [
  body("username")
    .trim()
    .isEmail().withMessage("Username must be a valid email")
    .normalizeEmail(),

  body("firstName")
    .trim()
    .isLength({ min: 1 }).withMessage("First name is required")
    .escape(),

  body("lastName")
    .trim()
    .isLength({ min: 1 }).withMessage("Last name is required")
    .escape(),

  body("password")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
    .matches(/\d/).withMessage("Password must contain at least one number"),

  body("confirmPassword")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    })
];

module.exports = singupValidation;