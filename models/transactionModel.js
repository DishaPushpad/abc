const config = require("../config");
const mysql = require("mysql2");
const { password, user } = require("../config");
const pool = mysql.createPool({
  host: config.mysqlHost,
  user: config.user,
  password: config.password,
  database: config.database,
  port: config.mysqlPort,
});

const promisePool = pool.promise();

class transactionModel {
  insertDetails = async (data) => {
    let sql = `INSERT INTO transaction(user_id,coin_id,buyCoin_Id,type,amount,buyAmount)VALUES('${data.user_id}','${data.coin_id}','${data.buyCoin_Id}','${data.type}','${data.amount}','${data.buyAmount}')`;
    const [result, fields] = await promisePool.query(sql);

    return result;
  };

  getAllTransactionDetail = async (user_id) => {
    let sql = `SELECT tr.user_id,tr.coin_id,tr.id,tr.datetime,tr.buyCoin_Id,tr.type,tr.amount,tr.buyAmount,users.first_name ,coin.coinName , coins.coinName as buyCoinName from transaction as tr LEFT JOIN users ON tr.user_id=users.id LEFT JOIN coins as coin ON tr.coin_id=coin.id LEFT JOIN coins ON tr.buyCoin_Id = coins.id WHERE tr.user_id=${user_id} ORDER by tr.id DESC`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  }

  getAllWithdrawTransactionsbyuser = async (user_id) => {
    let sql = `SELECT withdrawList.user_id,withdrawList.coin_id,withdrawList.id,withdrawList.createdAt,withdrawList.status,withdrawList.withdrawal_Address,withdrawList.amount,users.first_name AS userName,coins.coinName FROM  withdrawList LEFT JOIN users ON withdrawList.user_id = users.id LEFT JOIN coins ON withdrawList.coin_id= coins.id WHERE user_id = '${user_id}' ORDER BY withdrawList.id DESC`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  }


 


}
module.exports = new transactionModel();
