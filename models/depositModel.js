const config = require("../config");
const mysql = require("mysql2");
const { password } = require("../config");
const pool = mysql.createPool({
  host: config.mysqlHost,
  user: config.user,
  password: config.password,
  database: config.database,
  port: config.mysqlPort,
});

const promisePool = pool.promise();

class depositModel {
  insertFiat = async (data) => {
    let sql = `INSERT INTO depositFiat(user_id,coin_id,	balance,status,bank_name,admin_bank_id,upload_file,transaction_id) VALUES ('${data.user_id}','${data.coin_id}','${data.balance}','${data.status}','${data.bank_name}','${data.admin_bank_id}','${data.upload_file}','${data.transaction_id}')`;
    console.log('sql:::', sql);
    const [result, fields] = await promisePool.query(sql);
    return result;
  };

  // getAllDetail = async () => {
  //   let sql = `SELECT * FROM depositFiat`;
  //   const [result, fields] = await promisePool.query(sql);
  //   return result;
  // };
  
  getAllDetail = async () => {
    let sql = `SELECT depositFiat.user_id, depositFiat. coin_id, depositFiat.balance,depositFiat.id, depositFiat.status, depositFiat.bank_name, depositFiat.transaction_id, depositFiat. admin_bank_id , depositFiat.upload_file, depositFiat. created_At, users.first_name as userName ,coins.coinName ,Bankdetail.bank_name as admin_bank_name from depositFiat LEFT JOIN users ON depositFiat.user_id = users.id LEFT JOIN coins ON depositFiat.coin_id = coins.id LEFT JOIN Bankdetail ON depositFiat.admin_bank_id = Bankdetail.id ORDER BY depositFiat.id DESC `;
    const [result, fields] = await promisePool.query(sql);
    return result;
  };

  checkpreviousBalance = async (user_id,coin_id) => {
    let sql = `Select balance from userWallet where user_id = '${user_id}' and coin_id = '${coin_id}'`;

    const [result, fields] = await promisePool.query(sql);
    //console.log(sql,result)
    return result;
  };

  updateStatus = async (user_id) => {
    let sql = `UPDATE depositFiat SET status =1  where user_id ='${user_id}'`;
    const [result, fields] = await promisePool.query(sql);
    //console.log(sql,result)
    return result;
  };


  updateFiatStatus = async (user_id) => {
    let sql = `UPDATE depositFiat SET status =2 WHERE user_id ='${user_id}'`;
    const [result, fields] = await promisePool.query(sql);
    // console.log(sql, result)
    return result;
  };
  checkDetailsByid = async (user_id) => {
    let sql = `SELECT * FROM depositFiat where user_id ='${user_id}'`;
    const [result, fields] = await promisePool.query(sql);
    // console.log(sql, result)
    return result;
  };
  checkDetailsBycoinid = async (coin_id) => {
    let sql = `SELECT * FROM depositFiat where coin_id ='${coin_id}'`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  };

  getAllDepositTransactionsbyuser = async (user_id) => {
    let sql = `SELECT depositFiat.user_id,depositFiat.coin_id,depositFiat.id,depositFiat.created_At,depositFiat.status,depositFiat.balance,users.first_name AS userName,coins.coinName FROM  depositFiat LEFT JOIN users ON depositFiat.user_id = users.id LEFT JOIN coins ON depositFiat.coin_id= coins.id WHERE user_id = '${user_id}' ORDER BY depositFiat.id DESC`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  }

}




module.exports = new depositModel();
