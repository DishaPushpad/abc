const { validationResult } = require("express-validator");

const bankModel = require("../models/bankModel");

const insertDetails = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).send({
        status: false,
        msg: `${errors.errors[0].msg}`,
      });
    }
    let user_id = req.params.user_id;

    let GSTimage = !req.files["GSTimage"]
      ? null
      : req.files["GSTimage"][0].filename;
    let cancelledChequeImage = !req.files["cancelledChequeImage"]
      ? null
      : req.files["cancelledChequeImage"][0].filename;
    let bankStatementImage = !req.files["bankStatementImage"]
      ? null
      : req.files["bankStatementImage"][0].filename;

    let data = {
      user_id: user_id,
      bank_account_holder_name: req.body.bank_account_holder_name,
      branchName: req.body.branchName,
      AccountNumber: req.body.AccountNumber,
      ifsc_code: req.body.ifsc_code,
      panCardno: req.body.panCardno,
      accountType: req.body.accountType,
      GSTImage: GSTimage,
      cancelledChequeImage: cancelledChequeImage,
      bankStatementImage: bankStatementImage,
    };
    const insert = await bankModel.inserBankDetails(data, user_id);

    if (insert) {
      return res
        .status(201)
        .send({ status: true, msg: "bank details updated successfully" });
    } else {
      return res
        .status(400)
        .send({ status: false, msg: "something went wrong" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

const deleteBankDetails = async (req, res) => {
  try {
    let user_id = req.params.user_id;
    const check = await bankModel.checkUserByid(user_id);
    if (check.length > 0) {
      const deleteData = await bankModel.deleteDetails(user_id);
      if (deleteData) {
        return res
          .status(201)
          .send({ status: true, msg: "bank details deleted sucessfuly" });
      } else {
        return res
          .status(400)
          .send({ status: false, msg: "something went wrong" });
      }
    } else {
      return res
        .status(404)
        .send({ status: false, msg: "no details found by this user id" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

const getBankDetailsByID = async (req, res) => {
  try {
    let user_id = req.params.user_id;
    const check = await bankModel.checkUserByid(user_id);
    if (check.length > 0) {
      const getBankDetails = await bankModel.getBankDetails(user_id);
      if (getBankDetails) {
        return res
          .status(200)
          .send({ status: true, msg: "successfully", data: getBankDetails[0] });
      } else {
        return res
          .status(400)
          .send({ status: false, msg: "something went wrong" });
      }
    }
     else {
      return res
        .status(404)
        .send({ status: false, msg: "no details found by this user id" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

const getAllBankDetails = async (req, res) => {
  try {
    const getAllBankDetails = await bankModel.getAllDetails();
    if (getAllBankDetails) {
      return res
        .status(200)
        .send({ status: true, msg: "successfully", data: getAllBankDetails });
    } else {
      return res
        .status(400)
        .send({ status: false, msg: "something went wrong" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

const updateDetails = async (req, res) => {

  try {
    let user_id = req.params.user_id;

    const checkId = await bankModel.checkUserByid(user_id);

    let GSTImage = !req.files["GSTImage"]
      ? null
      : req.files["GSTImage"][0].filename;
    if (GSTImage) {
      req.body.GSTImage = GSTImage;
    } else {
      req.body.GSTImage = req.body.old_GSTImage;
    }

    let cancelledChequeImage = !req.files["cancelledChequeImage"]
      ? null
      : req.files["cancelledChequeImage"][0].filename;
    if (cancelledChequeImage) {
      req.body.cancelledChequeImage = cancelledChequeImage;
    } else {
      req.body.cancelledChequeImage = req.body.old_cancelledChequeImage;
    }

    let bankStatementImage = !req.files["bankStatementImage"]
      ? null
      : req.files["bankStatementImage"][0].filename;
    if (bankStatementImage) {
      req.body.bankStatementImage = bankStatementImage;
    } else {
      req.body.bankStatementImage = req.body.old_bankStatementImage;
    }

    let data = {
      user_id: req.body.user_id,
      bank_name: req.body.bank_name,
      bank_account_holder_name: req.body.bank_account_holder_name,
      branchName: req.body.branchName,
      AccountNumber: req.body.AccountNumber,
      ifsc_code: req.body.ifsc_code,
      panCardno: req.body.panCardno,
      accountType: req.body.accountType,
      company_name: req.body.company_name,
      GSTImage: req.body.GSTImage,
      cancelledChequeImage: req.body.cancelledChequeImage,
      bankStatementImage: req.body.bankStatementImage,
    };
   
    if (checkId.length > 0) {
      const update = await bankModel.updateDetails(data, user_id);
      if (update) {
        return res
          .status(201)
          .send({ status: true, msg: " Data updated successfully" });
      } else {
        return res
          .status(400)
          .send({ status: false, msg: "something went wrong" });
      }
    } else {
      const insert = await bankModel.inserBankDetails(data, user_id);
      return res
        .status(201)
        .send({ status: true, msg: " Data updated successfully" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ status: false, error: err.message });
  }
};

module.exports = {
  insertDetails,
  deleteBankDetails,
  getBankDetailsByID,
  getAllBankDetails,
  updateDetails,
};
