const userModel = require("../models/userModel");
const coinsModel = require("../models/coinsModel");
const userWalletModel = require("../models/userWalletModel");
const emailActivity = require("./emailActivity.controller");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("../config");
// const requestIp = require("request-ip");
const CryptoJS = require("crypto-js");
// const fetch = require("node-fetch");
// const Web3API = require("web3");
// const cw = require("crypto-wallets");
var keySize = 256;
var iterations = 100;
const axios = require("axios");


const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).send({
        status: false,
        msg: `${errors.errors[0].msg}`,
      });
    }

    let checkEmail = await userModel.getUserEmail(req.body.email);
    const Token = jwt.sign(
      {
        email: req.body.email,
      },
      config.JWT_SECRET_KEY
    );
    if (checkEmail.length > 0) {
      if (checkEmail[0].is_email_verify === 0) {
        let headerMSG = `You're almost there!`;
        let headerMSG1 = `crypto wallet is delighted to have you on board ! <br/>To start exploring crypto-wallet, please confirm your Email address.`;
        let mailmsg = `
          <h2>Please <a href='${config.mailUrl}verifyAccount/${Token}'>click here </a> to activate your account</h2>`;

        let mailMsg = emailActivity.Activity(
          req.body.email,
          "Account Activation Link",
          headerMSG,
          headerMSG1,
          mailmsg
        );

        return res.status(200).send({
          success: false,
          msg: "We have Sent a mail, Please activate your account",
        });
      } else {
        let hash = CryptoJS.SHA256(req.body.password).toString(
          CryptoJS.enc.Hex
        );

        if (checkEmail[0].password !== hash) {
          return res
            .status(400)
            .send({ status: false, msg: "Password does not match" });
        }

        let check = await userModel.findBlock(req.body.email);
        if (Object.values(check[0]) == 1) {
          return res.status(200).send({
            status: true,
            msg: "You cannot proceed further because you are blocked by admin",
          });
        }

        // if(checkEmail[0].id == 1){
        //   return res
        //   .status(400)
        //   .send({ status: false, msg: "We dont have user with this email" });

        // }

        const coin = await coinsModel.getCoinsDetails();

        for (let i in coin) {
          const checkDataById = await userWalletModel.checkDataById(
            checkEmail[0].id,
            coin[i].id
          );

          if (checkDataById.length == 0) {
            let wallet = {};

            if (
              [
                "BTC",
                "ETH",
                "USDT",
                "USDC",
                "INR",
                "AED",
                "EURO",
                "USD",
              ].includes(coin[i].symbol)
            ) {
              wallet = await web3fun(coin[i].symbol);
            }

            if (wallet) {
              var userwallet = {
                user_id: checkEmail[0].id,
                coin_id: coin[i].id,
                balance: 0,
                privateKey: wallet.privateKey
                  ? await encriptedKey(wallet.privateKey, "CryptoWallet123#")
                  : "",
                publicKey: wallet.publicKey,
              };
            }
            let create = await userWalletModel.insertDetails(userwallet);
          }
        }
        return res.status(201).send({
          status: true,
          msg: "Login successful",
          token: Token,
          data: checkEmail[0],
        });
      }
    } else {
      return res
        .status(400)
        .send({ status: false, msg: "We dont have user with this email" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

async function web3fun(symbol) {
  try {
    if (symbol == "BTC") {
      const bitCoinhdWallet = await axios.get(
        "http://blockchainexpert.co.in:7000/api/btc/create_wallet"
      );
      return {
        privateKey: bitCoinhdWallet.data.data.wallet.privateKey,
        publicKey: bitCoinhdWallet.data.data.wallet.address,
      };
    } else if (symbol == "ETH") {
      const ETHwallet = await axios.get(
        "http://blockchainexpert.co.in:7001/api/eth/create_wallet"
      );
      return {
        privateKey: ETHwallet.data.data.wallet.private,
        publicKey: ETHwallet.data.data.wallet.public,
      };
    } else if (symbol == "USDT") {
      const USDTwallet = await axios.get(
        "http://blockchainexpert.co.in:7001/api/eth/create_wallet"
      );
      return {
        privateKey: USDTwallet.data.data.wallet.private,
        publicKey: USDTwallet.data.data.wallet.public,
      };
    } else if (symbol == "USDC") {
      const USDCwallet = await axios.get(
        "http://blockchainexpert.co.in:7001/api/eth/create_wallet"
      );
      return {
        privateKey: USDCwallet.data.data.wallet.private,
        publicKey: USDCwallet.data.data.wallet.public,
      };
    } else if (symbol == "INR") {
      return {
        privateKey: "",
        publicKey: "",
      };
    } else if (symbol == "AED") {
      return {
        privateKey: "",
        publicKey: "",
      };
    } else if (symbol == "EURO") {
      return {
        privateKey: "",
        publicKey: "",
      };
    } else if (symbol == "USD") {
      return {
        privateKey: "",
        publicKey: "",
      };
    }
  } catch (err) {}
}
async function encriptedKey(pvkey, hash) {
  var private_key = pvkey;

  var salt = CryptoJS.lib.WordArray.random(128 / 8);
  var pass = hash;

  var key = CryptoJS.PBKDF2(pass, salt, {
    keySize: keySize / 32,
    iterations: iterations,
  });

  var iv = CryptoJS.lib.WordArray.random(128 / 8);

  var encrypted = CryptoJS.AES.encrypt(private_key, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });
  return (privateKey = salt.toString() + iv.toString() + encrypted.toString());
}







// forget password
const forgetPassword = async (req, res) => {
  try {
    const checkEmail = await userModel.getUserEmail(req.body.email);

    if (checkEmail.length > 0) {
      const Token = jwt.sign(
        {
          email: req.body.email,
        },
        config.JWT_SECRET_KEY
      );
      let mailmsg = `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:25px;text-align:left;color:#000">
    <h4>Please <a href='${config.mailUrl}resetpassword/${Token}'>Click here </a> to Reset  your Password</h4>
    </div>`;
      let headerMSG = ``;
      let headerMSG1 = `crypto wallet exchange is delighted to have you  ! `;
      let mailMsg = emailActivity.Activity(
        req.body.email,
        "Reset Password Link",
        headerMSG,
        headerMSG1,
        mailmsg
      );
      if (mailmsg) {
        return res.status(200).send({
          status: true,
          msg: "Please check your email for link to reset your password",
        });
      } else {
        return res.status(400).send({
          status: false,
          msg: "Something went wrong please try again later",
        });
      }
    } else {
      return res
        .status(400)
        .send({ status: false, msg: "Email is not registered" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};





const changePassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).send({
        status: false,
        msg: `${errors.errors[0].msg}`,
      });
    }
    const hash1 = CryptoJS.SHA256(req.body.old_password).toString(
      CryptoJS.enc.Hex
    );
    const checkPass = await userModel.checkPassword(req.body.email);
    if (checkPass[0].password !== hash1) {
      return res
        .status(400)
        .send({ status: false, msg: "Old password does not match" });
    }
    const hash = CryptoJS.SHA256(req.body.password).toString(CryptoJS.enc.Hex);

    const updatePass = await userModel.updatePassword(hash, req.body.email);

    if (updatePass) {
      return res
        .status(201)
        .send({ status: true, msg: " password updated successfully" });
    } else {
      return res.status(400).send({
        status: false,
        msg: "Something went wrong please try again later",
      });
    }
    //   }
    // );
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

const verifyAccount = async (req, res) => {
  try {
    let token = req.body.token;
    if (token) {
      jwt.verify(
        token,
        config.JWT_SECRET_KEY,
        async function (err, decodedToken) {
          if (err) {
            return res
              .status(400)
              .send({ status: false, msg: "incorrect or expired link" });
          }
          const verify = await userModel.verifyAccount(decodedToken.email);
          if (verify) {
            let headerMSG = ``;
            let headerMSG1 = `crypto wallet is delighted to have you  ! `;
            let mailmsg = `
                <div style="font-family:Arial,sans-serif;font-size:15px;line-height:25px;text-align:left;color:#000">
                <h4>Congratulation Your Account Have Been Successfully Verified</h4>
                </div>`;
            emailActivity.Activity(
              decodedToken.email,
              "Account Successfully Verified",
              headerMSG,
              headerMSG1,
              mailmsg
            );
            return res
              .status(200)
              .send({ status: true, msg: "Account successfully verified" });
          } else {
            return res.status({ status: false, msg: "Something went wrong" });
          }
        }
      );
    } else {
      return res
        .status(400)
        .send({ status: false, msg: " Something went wrong" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

const ResetPassword = async (req, res) => {
  try {
    let token = req.body.token;
    jwt.verify(
      token,
      config.JWT_SECRET_KEY,
      async function (err, decodedToken) {
        if (err) {
          return res
            .status(400)
            .send({ status: false, msg: "Invalid token or expired link" });
        }
        let hash = CryptoJS.SHA256(req.body.password).toString(
          CryptoJS.enc.Hex
        );
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(200).send({
            status: false,
            msg: `${errors.errors[0].msg}`,
          });
        }
        const ResetPassword = await userModel.resetPassword(
          hash,
          decodedToken.email
        );

        if (ResetPassword) {
          return res
            .status(201)
            .send({ status: true, msg: "password reset successfull" });
        } else {
          return res.status(400).send({
            status: false,
            msg: "Something went wrong please try again later",
          });
        }
      }
    );
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

module.exports = {
  login,
  forgetPassword,
  changePassword,
  verifyAccount,
  ResetPassword,
};
