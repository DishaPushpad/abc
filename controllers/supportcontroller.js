const supportModel = require("../models/supportModel");
const { validationResult } = require("express-validator");

const insertsupportDetails = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).send({
        status: false,
        msg: `${errors.errors[0].msg}`,
      });
    }

    const insert = await supportModel.insertDetails(req.body);
    if (insert) {
      return res.status(201).send({ status: true, msg: "succesfully" });
    } else {
      return res
        .status(400)
        .send({ status: false, msg: "Something went wrong" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

const getsupportDetails = async (req, res) => {
  try {
    const getAllDetails = await supportModel.getDetails();
    if (getAllDetails) {
      return res
        .status(200)
        .send({ status: true, msg: "successfully", data: getAllDetails });
    } else {
      return res
        .status(400)
        .send({ status: false, msg: "Something went wrong" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

module.exports = { insertsupportDetails, getsupportDetails };
