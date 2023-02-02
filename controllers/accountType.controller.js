const accountModel = require("../models/accountTypeModel");
const { validationResult } = require("express-validator");

const createAccountType = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .send({ status: false, msg: `${errors.errors[0].msg}` });
    }

    const create = await accountModel.insertAccount(req.body);
    if (create) {
      return res.status(201).send({ status: true, msg: "successfull" });
    } else {
      return res
        .status(400)
        .send({ status: true, msg: "Something went wrong" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

const deleteAccountData = async (req, res) => {
  try {
    let id = req.params.id;

    const checkId = await accountModel.checkId(id);
    if (checkId.length > 0) {
      const deleteData = await accountModel.deleteAccount(id);
      if (deleteData) {
        return res
          .status(201)
          .send({ status: true, msg: "data deleted successfully" });
      } else {
        return res.status(400).send({
          status: false,
          msg: " Something went wrong please try again later",
        });
      }
    } else {
      return res
        .status(404)
        .send({ status: false, msg: " this id does not belong " });
    }
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

const getAllAccountDetails = async (req, res) => {
  try {
    const details = await accountModel.getAll();
    if (details) {
      return res
        .status(200)
        .send({ status: true, msg: "successfull", data: details });
    } else {
      return res.status(400).send({
        status: false,
        msg: " Something went wrong please try again ",
      });
    }
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

module.exports = { createAccountType, deleteAccountData, getAllAccountDetails };
