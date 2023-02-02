const config = require("../config");
const mysql = require("mysql2");
const { password } = require("../config");
const { deleteDetails } = require("./bankModel");
const pool = mysql.createPool({
  host: config.mysqlHost,
  user: config.user,
  password: config.password,
  database: config.database,
  port: config.mysqlPort,
});

const promisePool = pool.promise();

class webContentModel {
  insertDetails = async (data) => {
    let sql = `INSERT INTO webContent(Aboutus,	privacy_policy)VALUES('${data.Aboutus}','${data.privacy_policy}')`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  };

  deleteDetails = async (id) => {
    let sql = `DELETE FROM webContent WHERE id ='${id}'`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  };

  updateDetails = async (data) => {
    let sql = `UPDATE webContent SET 
        Aboutus='${data.Aboutus}',
        privacy_policy='${data.privacy_policy}'`;
    console.log(sql);
    const [result, fields] = await promisePool.query(sql);
    return result;
  };

  getDetails = async () => {
    let sql = `SELECT * FROM webContent`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  };
  checkUserByid = async (id) => {
    let sql = `SELECT * FROM  webContent WHERE id='${id}'`;
    const [result, fields] = await promisePool.query(sql);

    return result;
  };
}
module.exports = new webContentModel();
