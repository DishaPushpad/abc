const CryptoJS = require("crypto-js");
const { validationResult } = require("express-validator");
const emailActivity = require("./emailActivity.controller");
const config = require("../config");
const { request } = require("express");
const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");

const userModel = require("../models/userModel");

const registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).send({
        status: false,
        msg: `${errors.errors[0].msg}`,
      });
    }
    let checkEmail = await userModel.getUserEmail(req.body.email);
    if (checkEmail.length > 0) {
      return res
        .status(409)
        .send({ status: false, msg: "duplicate email not allowed" });
    }
    const Token = jwt.sign(
      {
        email: req.body.email,
      },
      config.JWT_SECRET_KEY
    );

    let headerMSG = `You're almost there!`;
    let headerMSG1 = `crypto wallet is delighted to have you on board ! <br/>To start exploring crypto wallet, please confirm your Email address.`;

    let mailmsg11 = `
                <h2>Please <a href='${config.mailUrl}verifyAccount/${Token}'>click here </a> to activate your account</h2>`;

    let mailMsg = emailActivity.Activity(
      req.body.email,
      "Account Activation Link",
      headerMSG,
      headerMSG1,
      mailmsg11
    );
  
    if (mailMsg) {
      let secret = speakeasy.generateSecret({ length: 20 });
      QRCode.toDataURL(secret.otpauth_url, async function (err, data_url) {
        let hash = CryptoJS.SHA256(req.body.password).toString(
          CryptoJS.enc.Hex
        );

        let data = {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
          password: hash,
          image: req.body.image ? req.body.image : "",
        };
        const dataEnter = await userModel.saveUserDetails(data);

        if (dataEnter) {
          return res.status(201).send({
            status: true,
            msg: "Email has been sent succesfully",
            Token: Token,
          });
        } else {
          return res
            .status(400)
            .send({ status: false, msg: " Something went wrong" });
        }
      });
    } else {
      return res
        .status(400)
        .send({ status: false, msg: " Something went wrong" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

module.exports = { registerUser };
