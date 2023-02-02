const transactionModel = require("../models/transactionModel");
const userWalletModel = require("../models/userWalletModel");
const { validationResult } = require("express-validator");

const exchange = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).send({
        status: false,
        msg: `${errors.errors[0].msg}`,
      });
    }

    let user_id = req.body.user_id;
    let type = req.body.type;
    let amount = req.body.amount;
    let coin_id = req.body.coin_id;
    let coinId = req.body.buyCoin_Id;
    let buyAmount = req.body.buyAmount;

    let checkBalance = await userWalletModel.checkBalance(req.body);

    if (checkBalance[0].balance >= amount) {
      let checkDataById = await userWalletModel.checkDataById1(user_id);

      if (checkDataById.length >= 0) {
        // if (type == 1) {
        console.log('user_idin_idamount', user_id,
          coin_id,
          amount)
        let deductAmt = await userWalletModel.updateBalancebyid(
          user_id,
          coin_id,
          amount
        );
        if (deductAmt) {
          let updatWallet = await userWalletModel.Balancebyid(
            user_id,
            coinId,
            buyAmount
          );
          if (updatWallet) {
            const insertIntoTransaction =
              await transactionModel.insertDetails(req.body);
            if (insertIntoTransaction) {
              return res.status(201).send({
                status: true,
                msg: "successfully",
                data: "Order placed successfully",
              });
            } else {
              return res
                .status(400)
                .send({ status: false, msg: "Something went wrong" });
            }
          } else {
            return res
              .status(400)
              .send({ status: false, msg: "Something went wrong" });
          }
        } else {
          return res
            .status(400)
            .send({ status: false, msg: "Something went wrong" });
        }
        // }



















        // else if (type == 2) {
        //   let sell = await userWalletModel.Balancebyid1(
        //     user_id,
        //     coinId,
        //     buyAmount
        //   );
        //   if (sell) {
        //     let updatWallet = userWalletModel.updateBalancebyid1(
        //       user_id,
        //       coin_id,
        //       amount
        //     );
        //     if (updatWallet) {
        //       const insertIntoTransaction =
        //         await transactionModel.insertDetails(req.body);
        //       if (insertIntoTransaction) {
        //         return res.status(201).send({
        //           status: true,
        //           msg: "balance deducted successfully",
        //           data: "data inserted successfully in transaction model",
        //         });
        //       } else {
        //         return res
        //           .status(400)
        //           .send({ status: false, msg: "Something went wrong" });
        //       }
        //     } else {
        //       return res
        //         .status(400)
        //         .send({ status: false, msg: "Something went wrong" });
        //     }
        //   }
        // }
      } else {
        return res
          .status(404)
          .send({ status: false, msg: "No user found by this id " });
      }
    } else {
      return res
        .status(400)
        .send({ status: false, msg: "Balance should be equal or greater than amount" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

module.exports = { exchange };
