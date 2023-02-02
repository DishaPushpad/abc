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
class adminModel{
    insertadminDetails = async (data) => {
        let sql = `INSERT INTO admin_detail (user_id,coin_id,balance,privateKey,publicKey) VALUES ('${data.user_id}','${data.coin_id}','${data.balance}','${data.privateKey}','${data.publicKey}')`;
        const [result, fields] = await promisePool.query(sql);
        return result;
      };
}
module.exports=new adminModel