const userModel = require("../models/userModel");
const supportModel = require("../models/supportModel");

// total users //today subscriber //total subscribers

const getdashBoardData = async (req, res) => {
  try {
    const totalSubscriber = await supportModel.getAllsubscriberList();
    const totalUsers = await userModel.getAllUsersList();
    const todayRegistered = await userModel.getUserOfToday();
    const totalAmount = await userModel.getTotalAmount()

    return res.status(200).send({
      status: true,
      totaluser: Object.values(totalUsers[0])[0],
      totalSubscriber: Object.values(totalSubscriber[0])[0],
      todayRegistered: Object.values(todayRegistered[0])[0],
      totalAmount:Object.values(totalAmount[0])[0]
    });
  } catch (err) {
    return res.status(500).send({ status: false, Error: err.message });
  }
};

module.exports = { getdashBoardData };
