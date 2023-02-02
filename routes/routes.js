const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const config = require("../config");
const cron = require("node-cron");
const app = express();
require("dotenv").config();
const cors = require("cors");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
router.use(bodyParser.json());
router.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const pool = mysql.createPool({
  host: config.mysqlHost,
  user: config.user,
  password: process.env.DB_PASS || config.password,
  database: config.database,
  port: config.mysqlPort,
});
const promisePool = pool.promise();

// for uploading images in database
const multer = require("multer");
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    let filetype = "";
    if (file.mimetype === "image/png") {
      filetype = "png";
    }
    if (file.mimetype === "image/jpeg") {
      filetype = "jpeg";
    }
    if (file.mimetype === "image/jpg") {
      filetype = "jpg";
    }
    if (file.mimetype === "video/mp4") {
      filetype = "mp4";
    }
    if (file.mimetype === "application/pdf") {
      filetype = "pdf";
    }
    cb(null, "image-" + Date.now() + "." + filetype);
  },
});
let upload = multer({ storage: storage });
let profileUpload = upload.fields([{ name: "image", maxCount: 10 }]);
// let profileUploadData = upload.fields([{ name: "image", maxCount: 10 }]);

let bankUpload = upload.fields([
  { name: "GSTImage", maxCount: 10 },
  { name: "cancelledChequeImage", maxCount: 10 },
  { name: "bankStatementImage", maxCount: 10 },
]);

let bankUploadData = upload.fields([
  { name: "GSTImage", maxCount: 10 },
  { name: "cancelledChequeImage", maxCount: 20 },
  { name: "bankStatementImage", maxCount: 30 },
]);

let insertFiat = upload.fields([{ name: "upload_file", maxCount: 10 }]);

let Uploads = upload.fields([
  { name: "image", maxCount: 10 },
  { name: "BankStatement", maxCount: 10 },
  { name: "userImage", maxCount: 10 }
]);





//  test--------
router.get("/testme", function (req, res) {
  try {
    return res.send({ status: true, msg: "successfull" });
  } catch (err) {
    return res.send({ status: false, error: err.message });
  }
});

// controllers
const registercontroller = require("../controllers/register.controller");
const logincontroller = require("../controllers/login.controller");
const usercontroller = require("../controllers/user.controller");
const exchangeController = require("../controllers/exchangeController");

// identity controller
const identitycontroller = require("../controllers/identity.controller");
// kyc controller
const kycController = require("../controllers/kycController");

// bank controller
const bankcontroller = require("../controllers/bankcontroller");

// accountcontroller
const accountcontroller = require("../controllers/accountType.controller");

//
const FAQcontroller = require("../controllers/FAQcontroller");
const supportcontroller = require("../controllers/supportcontroller");
const webController = require("../controllers/webContentcontroller");

const depositController = require("../controllers/depositController");
const dashBoardController = require("../controllers/dashBoardController");
const withdrawalcontroller = require("../controllers/withdrawalcontroller");

const transactionController = require("../controllers/transactionController")
// all schema
const {
  registerUserSchema,
  loginUserSchema,
  forgetPasswordSchema,
  changePasswordSchema,
  resetPasswordSchema,
  withdrawSchema,
  statusSchema,
} = require("../middleware/validators/userValidators.middleware");

router.post(
  "/createUser",
  registerUserSchema,
  registercontroller.registerUser.bind()
);

router.post("/loginuser", loginUserSchema, logincontroller.login.bind());

//------------------------  forget password-------------------------
router.post(
  "/forgetPassword",
  forgetPasswordSchema,
  logincontroller.forgetPassword.bind()
);
// ----------------------- reset password----------------------
router.post(
  "/changePassword",
  changePasswordSchema,
  logincontroller.changePassword.bind()
);
//----------------------- verify account-------------------------

router.post("/verifyAccount", logincontroller.verifyAccount.bind());
//------------------------ resetPassword-------------------------

router.post(
  "/resetPassword",
  resetPasswordSchema,
  logincontroller.ResetPassword.bind()
);
// -------------------------update user-------------------------

router.put(
  "/updateUser/:id",
  profileUpload,
  usercontroller.updateUserById.bind()
);
//------------------- get user by id--------------------------

router.get("/getUserDetailsById/:id", usercontroller.getUserDetailById.bind());
//  --------------------get all user--------------------------
router.get("/getAllUserDetails", usercontroller.getAllUsers.bind());

//  block and unblock

router.put("/updateBlock/:id", usercontroller.updateBlock.bind());

// insert data into identity model

router.post("/insertIdentity", identitycontroller.insertIdentity.bind());

// update data in identity model

router.put("/updateIdentity/:id", identitycontroller.updateIdentity.bind());

//  delete data from identity model
router.delete("/deleteData/:id", identitycontroller.deleteIdentity.bind());

// get all list
router.get("/getAllIdentity", identitycontroller.getAllData.bind());
//   kyc apis

router.post("/InsertKycData", Uploads, kycController.insertData.bind());

// get kyc by id
router.get("/getAllKycDetail", kycController.getAllkyc.bind());

//getKycDetailById
router.get("/getKycDetailById/:id", kycController.getKycById.bind());

// update kyc approval
router.put("/successKyc/:id", kycController.UpdateSuccessKyc.bind());
// reject kyc approval
router.put("/rejectKyc/:id", kycController.rejectKyc.bind());
//  bank details
router.post(
  "/insertBankDetails/:user_id",
  bankUpload,
  bankcontroller.insertDetails.bind()
);

router.delete(
  "/deletBankeData/:user_id",
  bankcontroller.deleteBankDetails.bind()
);

router.get(
  "/getBankDetailsById/:user_id",
  bankcontroller.getBankDetailsByID.bind()
);

router.get("/getAllBankDetails", bankcontroller.getAllBankDetails.bind());
router.put(
  "/updateBankDetails/:user_id",
  bankUploadData,
  bankcontroller.updateDetails.bind()
);

// accountType
router.post("/accountType", accountcontroller.createAccountType.bind());
// delete acc details
router.delete(
  "/deleteAccountData/:id",
  accountcontroller.deleteAccountData.bind()
);
// get all data
router.get(
  "/getAllAccountDetails",
  accountcontroller.getAllAccountDetails.bind()
);

// support
router.post(
  "/insertsupportDetails",
  supportcontroller.insertsupportDetails.bind()
);
router.get("/getsupportDetails", supportcontroller.getsupportDetails.bind());

// faq
router.post("/insertfaqDetails", FAQcontroller.insertfaqDetails.bind());
router.delete("/deletefaqDetails/:id", FAQcontroller.deletefaqDetails.bind());
router.get("/getfaqDetails", FAQcontroller.getfaqDetails.bind());
router.put("/updatefaqDetails/:id", FAQcontroller.updatefaqDetails.bind());

// web content
router.post("/insertDetails", webController.insertDetails.bind());
router.delete("/deleteDetails/:id", webController.deleteDetails.bind());
router.get("/getDetails", webController.getDetails.bind());
router.get("/getDetails1", webController.getDetails1.bind());

router.put("/updateDetails/:id", webController.updateDetails.bind());

//  deposit fiat
router.post("/depositFiat", insertFiat, depositController.depositFiat.bind());

router.get("/getAllfiatDetails", depositController.getAllfiatDetails.bind());
// update status
router.put(
  "/updateStatusDetails",
  depositController.updateStatusDetails.bind()
);

router.get("/getAllDepositTransactionsbyuser/:user_id",depositController.getAllDepositTransactionsbyuser.bind())

// buy and sell exchange
router.post("/exchange", exchangeController.exchange.bind());

//dashBoardData
router.get("/dashBoardData", dashBoardController.getdashBoardData.bind());

// withdraw  btc
router.post("/withdrawcrypto", withdrawalcontroller.withdrawcrypto.bind());
// get details
router.get("/getWithdrawalDetails", withdrawalcontroller.getAllList.bind());

//  update status
router.put(
  "/updatestatus",
  statusSchema,
  withdrawalcontroller.updateStatus.bind()
);
// bank withdraw by INR

router.post(
  "/bankWithdraw",
  withdrawSchema,
  withdrawalcontroller.bankWithdraw.bind()
);

//get all coin detail by id
router.get(
  "/getAllDetailsOfcoin/:user_id",
  withdrawalcontroller.getAllDetailsOfcoin.bind()
);

router.get("/getAllTransactionDetail/:user_id",transactionController.getAllTransactionDetail.bind())

router.get("/getAllWithdrawTransactionsbyuser/:user_id",transactionController.getAllWithdrawTransactionsbyuser.bind())



function ensureWebToken(req, res, next) {
  const x_access_token = req.headers["authorization"];
  if (typeof x_access_token !== undefined) {
    req.token = x_access_token;
    verifyJWT(req, res, next);
  } else {
    res.sendStatus(403);
  }
}
async function verifyJWT(req, res, next) {
  jwt.verify(req.token, config.JWT_SECRET_KEY, async function (err, data) {
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
      const _data = await jwt.decode(req.token, {
        complete: true,
        json: true,
      });
      req.user = _data["payload"];
      req.user_id = req.user.id;
      req.email = req.user.email;

      next();
    }
  });
}

router.post("*",function(req,res){
return res.status(404).send({status:false ,data:null, msg:"invalid request {url not found}" });
});


router.get("*",function(req,res){
  return res.status(404).send({status:false ,data:null, msg:"invalid request {url not found}" });
  });

module.exports.routes = router;
