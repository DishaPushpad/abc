const userModel = require("../models/user.model");

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
        .send({ status: false, msg: "something went wrong" });
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
          .send({ status: true, msg: "successfull", data: getDetails });
      } else {
        return res
          .status(400)
          .send({ status: false, msg: "something went wrong" });
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
      req.body.image = req.body.old_image;
    }

    let id = req.params.id;

    const updateUser = await userModel.userUpdateById(req.body,id);
    console.log('updateUser',updateUser);
    if (updateUser) {
      return res
        .status(201)
        .send({ status: true, msg: "user details updated successfully" });
    } else {
      return res
        .status(400)
        .send({ status: false, msg: " somwthing went wrong" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

module.exports = { getAllUsers, getUserDetailById, updateUserById };
