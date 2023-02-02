const userModel = require("../models/userModel");
const { validationResult } = require("express-validator");
const getAllUsers = async (req, res) => {
  try {
    const AllDetails = await userModel.getAllDetail();
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

const getUserDetailById = async (req, res) => {
  try {
    const id = req.params.id;

    const checkId = await userModel.FindById(id);
    if (checkId) {
      const getDetails = await userModel.getUserById(id);

      if (getDetails) {
        return res
          .status(200)
          .send({ status: true, msg: "successfull", data: getDetails[0] });
      } else {
        return res
          .status(400)
          .send({ status: false, msg: "Something went wrong" });
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

const updateUserById = async (req, res) => {
  try {
    let image = !req.files["image"] ? null : req.files["image"][0].filename;
    if (image) {
      req.body.image = image;
    } else {
      req.body.image = req.body.old_profile_pic;
    }

    let id = req.params.id;

    const updateUser = await userModel.userUpdateById(req.body, id);
 
    if (updateUser) {
      return res
        .status(201)
        .send({ status: true, msg: "User details updated successfully" });
    } else {
      return res
        .status(400)
        .send({ status: false, msg: " somwthing went wrong" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

const updateBlock = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).send({
        status: false,
        msg: `${errors.errors[0].msg}`,
      });
    }
    let id = req.params.id;
    let value = Object.values(req.body);

    if (value == 0) {
      const update = await userModel.unblock(id);
      if (update) {
        return res
          .status(201)
          .send({ status: true, msg: "you are unblocked by admin" });
      } else {
        return res
          .status(400)
          .send({ status: false, msg: " somwthing went wrong" });
      }
    } else {
      const block = await userModel.blockUser(id);
      if (block) {
        return res
          .status(201)
          .send({ status: true, msg: "you are blocked by admin" });
      } else {
        return res
          .status(400)
          .send({ status: false, msg: " somwthing went wrong" });
      }
    }
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

module.exports = {
  getAllUsers,
  getUserDetailById,
  updateUserById,
  updateBlock,
};
