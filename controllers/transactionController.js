const transactionModel = require("../models/transactionModel");

const getAllTransactionDetail = async (req, res) => {
  try {
    let user_id = req.params.user_id;

    const getAllDetails = await transactionModel.getAllTransactionDetail(user_id);
    if (getAllDetails.length > 0) {
      return res
        .status(200)
        .send({ status: true, msg: " successful", data: getAllDetails });
    } else {
      return res.status(400).send({ status: false, msg: "no deatils found" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};


const getAllWithdrawTransactionsbyuser = async (req, res) => {
  try {
    let user_id = req.params.user_id;

    const getAllList = await transactionModel.getAllWithdrawTransactionsbyuser(user_id);
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

module.exports = { getAllTransactionDetail,getAllWithdrawTransactionsbyuser };
