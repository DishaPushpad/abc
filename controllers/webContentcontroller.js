const webContentModel = require("../models/webContentModel");
const { validationResult } = require("express-validator");

const insertDetails = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).send({
        status: false,
        msg: `${errors.errors[0].msg}`,
      });
    }

    const insert = await webContentModel.insertDetails(req.body);
    if (insert) {
      return res.status(201).send({ status: true, msg: "updated succesfully" });
    } else {
      return res
        .status(400)
        .send({ status: false, msg: "Something went wrong" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

const deleteDetails = async (req, res) => {
  try {
    let id = req.params.id;
    const check = await webContentModel.checkUserByid(id);
    if (check.length > 0) {
      const deleteData = await webContentModel.deleteDetails(id);
      if (deleteData) {
        return res
          .status(201)
          .send({ status: true, msg: "details deleted sucessfuly" });
      } else {
        return res
          .status(400)
          .send({ status: false, msg: "Something went wrong" });
      }
    } else {
      return res
        .status(404)
        .send({ status: false, msg: "no details found by this id" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

const getDetails = async (req, res) => {
  try {
    const getAllDetails = await webContentModel.getDetails();
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

const getDetails1 = async (req, res) => {
  try {
    const getAllDetails = await webContentModel.getDetails();
    if (getAllDetails) {
      return res
        .status(200)
        .send({ status: true, msg: "successfully", data: getAllDetails[0] });
    } else {
      return res
        .status(400)
        .send({ status: false, msg: "Something went wrong" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

const updateDetails = async (req, res) => {

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .send({ status: false, msg: `${errors.errors[0].msg}` });
    }

    let id = req.params.id;

    const update = await webContentModel.updateDetails(req.body, id);

    if (update) {
      return res
        .status(201)
        .send({ status: true, msg: "Data updated successfully" });
    } else {
      return res
        .status(400)
        .send({ status: false, msg: "Something went wrong please try later" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};
module.exports = { insertDetails, deleteDetails, getDetails,getDetails1, updateDetails };
