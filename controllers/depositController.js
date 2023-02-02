const depositModel = require("../models/depositModel");
const userWalletModel = require("../models/userWalletModel");
const { validationResult } = require("express-validator");

const depositFiat = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).send({
        status: false,
        msg: `${errors.errors[0].msg}`,
      });
    }
    let upload_file = !req.files["upload_file"]
      ? null
      : req.files["upload_file"][0].filename;

    const data = {
      user_id: req.body.user_id,
      coin_id: req.body.coin_id,

      balance: req.body.balance,
      status: req.body.status,
      bank_name: req.body.bank_name,
      transaction_id: req.body.transaction_id,
      admin_bank_id: req.body.admin_bank_id,
      upload_file: upload_file,
    };

    const insertFiat = await depositModel.insertFiat(data);
    if (insertFiat) {
      return res
        .status(201)
        .send({ status: true, msg: "Data inserted successfully" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, Error: err.message });
  }
};

const getAllfiatDetails = async (req, res) => {
  try {
    const AllDetails = await depositModel.getAllDetail();
    if (AllDetails) {
      return res
        .status(200)
        .send({ status: true, msg: "success", data: AllDetails });
    } else {
      return res
        .status(200)
        .send({ status: false, msg: "Something went wrong" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

const updateStatusDetails = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).send({
        status: false,
        msg: `${errors.errors[0].msg}`,
      });
    }

    let user_id = req.body.user_id;

    let coin_id = req.body.coin_id;

    let balance = req.body.balance;

    let checkDetailsByuser_id = await depositModel.checkDetailsByid(user_id);
    console.log(checkDetailsByuser_id)
    if (checkDetailsByuser_id.length > 0) {
      let checkDetailsBycoin_id = await depositModel.checkDetailsBycoinid(
        coin_id
      );
      if (checkDetailsBycoin_id.length > 0) {
        let statusData = req.body.status;
        if (statusData == 1) {
          const checkUserWalletById = await userWalletModel.getIdDetails(
            user_id
          );
          if (checkUserWalletById.length > 0) {
            const updateStatus = await depositModel.updateStatus(user_id);
            if (updateStatus) {
            const checkpreviousBalance = await depositModel.checkpreviousBalance(user_id,coin_id);

              let previousbalance = checkpreviousBalance[0].balance;
              console.log('previousbalance',previousbalance)
              const updateUserWallet = await userWalletModel.updateBalance(
                previousbalance,
                balance,
                user_id,
                coin_id
              );

              if (updateUserWallet) {
                return res.status(201).send({
                  status: true,
                  msg: "balance updated and status approved",
                });
              } else {
                return res
                  .status(404)
                  .send({ status: false, msg: "Something went wrong" });
              }
            } else {
              return res
                .status(400)
                .send({ status: false, msg: "Something went wrong" });
            }
          } else {
            return res.status(404).send({
              status: false,
              msg: "no details found in user wallet by this id",
            });
          }
        } else if (statusData == 2) {
          const rejectStatus = await depositModel.updateFiatStatus(user_id);
          if (rejectStatus) {
            return res
              .status(201)
              .send({ status: true, msg: "status is rejected" });
          }
        } else {
          return res
            .status(400)
            .send({ status: false, msg: "Something went wrong" });
        }
      } else {
        return res
          .status(404)
          .send({ status: false, msg: "no details  found by this id" });
      }
    } else {
      return res
        .status(404)
        .send({ status: false, msg: "no user found by this id" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};


const getAllDepositTransactionsbyuser = async (req, res) => {
  try {
    let user_id = req.params.user_id;

    const getAllList = await depositModel.getAllDepositTransactionsbyuser(user_id);
    if (getAllList) {
      return res.status(200).send({ status: true, data: getAllList });
    } else {
      return res.status(400).send({
        status: false,
        msg: "Something went wrong",
      });
    }
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

module.exports = { depositFiat, getAllfiatDetails, updateStatusDetails ,getAllDepositTransactionsbyuser};
