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

class withdrawalModel{
   
    insertDetails=async(data)=>{
        let sql =`INSERT INTO withdrawList(user_id,coin_id,	withdrawal_Address,amount)VALUES('${data.user_id}','${data.coin_id}','${data.withdrawal_Address}','${data.amount}')`
        const [result, fields] = await promisePool.query(sql);
        return result;
    }
    
    updateStatus = async(data)=>{
        let sql = `update withdrawList set status = 1 where user_id ='${data.user_id}' and coin_id='${data.coin_id}'`;
        const [result, fields] = await promisePool.query(sql);
        return result;
    }

    getAllList= async()=>{
        let sql = `SELECT withdrawList.user_id,withdrawList.coin_id,withdrawList.id,withdrawList.createdAt,withdrawList.status,withdrawList.withdrawal_Address,withdrawList.amount,users.first_name AS userName,coins.coinName FROM withdrawList LEFT JOIN users ON withdrawList.user_id = users.id LEFT JOIN coins ON withdrawList.coin_id= coins.id ORDER BY withdrawList.id DESC`;
        const [result, fields] = await promisePool.query(sql);
        return result;
    }
    
    updateStatus1 = async(data)=>{
        console.log('3333333333333',data)
        let sql = `UPDATE withdrawList SET status = '${data.status}'  WHERE user_id ='${data.user_id}' and coin_id='${data.coin_id}' and id = '${data.id}'`;
        const [result, fields] = await promisePool.query(sql);
        return result;
    } 

    checkUserByid = async (data) => {
        let sql = `SELECT * FROM withdrawList WHERE user_id = '${data.user_id}'and coin_id ='${data.coin_id}'`;
        const [result, fields] = await promisePool.query(sql);
        return result;
      };
}

module.exports=new withdrawalModel()