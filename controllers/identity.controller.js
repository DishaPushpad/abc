const { validationResult } = require("express-validator");
const config = require("../config");
const IdentityModel = require("../models/Identity_proof.model");

const insertIdentity = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .send({ status: false, msg: `${errors.errors[0].msg}` });
    }
    let insertIdentity = await IdentityModel.InsertIdentity(req.body);
    if (insertIdentity) {
      return res
        .status(201)
        .send({ status: true, msg: "indentity inserted successfully" });
    } else {
      return res.status(400).send({
        status: false,
        msg: "Something went wrong please try again later",
      });
    }
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

const updateIdentity = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .send({ status: false, msg: `${errors.errors[0].msg}` });
    }

    let id = req.params.id;

    const update = await IdentityModel.updateIdentity(req.body, id);

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

const deleteIdentity = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .send({ status: false, msg: `${errors.errors[0].msg}` });
    }
    let id = req.params.id;
    const deleteData = await IdentityModel.deleteIdentity(id);
    if (deleteData) {
      return res
        .status(201)
        .send({ status: true, msg: "data deleted successfully" });
    } else {
      return res
        .status(400)
        .send({ status: false, msg: "Something went wrong" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

const getAllData = async (req, res) => {
  try {
    const getAllData = await IdentityModel.getAllData();
    if (getAllData) {
      return res
        .status(200)
        .send({ status: true, msg: "success", data: getAllData });
    } else {
      return res
        .status(400)
        .send({ status: false, msg: "Something went wrong" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

module.exports = { insertIdentity, updateIdentity, deleteIdentity, getAllData };
