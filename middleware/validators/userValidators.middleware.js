const { body, check } = require("express-validator");

exports.registerUserSchema = [
  check("email")
    .not()
    .isEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("please write a valid email"),
  check("password")
    .not()
    .isEmpty()
    .withMessage("password is required")
    .notEmpty()
    .isLength({ min: 5 })
    .withMessage("Password must contain minimum 5 characters"),
  check("confirm_password")
    .not()
    .isEmpty()
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Password and confirm password does not match"),
];

exports.loginUserSchema = [
  check("email")
    .not()
    .isEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be a valid email"),
  check("password").not().isEmpty().withMessage("Password is required"),
];

exports.forgetPasswordSchema = [
  check("email")
    .not()
    .isEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("please enter a valid email"),
];

exports.changePasswordSchema = [
  check("old_password")
    .not()
    .isEmpty()
    .withMessage(" old_password is required"),
  check("password")
    .not()
    .isEmpty()
    .withMessage("password is required")
    .notEmpty()
    .isLength({ min: 5 })
    .withMessage("password should have minimun 5 characters"),
  check("confirm_password")
    .not()
    .isEmpty()
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Password and confirm password does not match"),
];

exports.resetPasswordSchema = [
  check("password")
    .not()
    .isEmpty()
    .withMessage("password is required")
    .notEmpty()
    .isLength({ min: 5 })
    .withMessage("password should have minimun 5 characters"),
];

exports.bankDetailsSchema = [
  check("	bank_account_holder_name")
    .not()
    .isEmpty()
    .withMessage("Bank account holder name is required")
    .notEmpty()
    .isLength({ min: 5 })
    .withMessage(
      "Account holder name should be  should have minimun 5 characters"
    ),
  check("branchName").not().isEmpty().withMessage("Branch name is required"),
  check("AccountNumber").not().isEmpty().withMessage("Account no is required"),
  check("	ifsc_code").not().isEmpty().withMessage("Ifsc code no is required"),
  check("	panCardno").not().isEmpty().withMessage("PanCardno no is required"),
];
exports.withdrawSchema=[
  check("user_id")
  .not().isEmpty()
  .withMessage("user_id is required"),
  check("coin_id")
  .not().isEmpty()
  .withMessage("coin_id is required"),
  check("amount")
  .not().isEmpty()
  .withMessage("amount is required")

]

exports.statusSchema=[
  check("user_id")
  .not().isEmpty()
  .withMessage("user_id is required"),
  check("coin_id")
  .not().isEmpty()
  .withMessage("coin_id is required")
]