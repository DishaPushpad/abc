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

class kycModel {
  insertData = async (data) => {
    let sql = `INSERT INTO KYC (user_id,user_name,dob,email,identity_proof_id,image,doc_no,Address,BankStatement,phoneNo,kyc_status,userImage) VALUES ('${data.user_id}','${data.user_name}','${data.dob}','${data.email}','${data.identity_proof_id}','${data.image}','${data.doc_no}','${data.Address}','${data.BankStatement}','${data.phoneNo}',1,'${data.userImage}')`;
    const [result, fields] = await promisePool.query(sql);
    return result;
  };

  getAllkyc = async () => {
    let sql = `SELECT KYC.id,KYC.user_id,KYC.user_name,KYC.dob,KYC.email,KYC.identity_proof_id,KYC.image,KYC.doc_no,KYC.Address,KYC.kyc_status,users.id as userId ,Identity_proof.identity_name as identity_name FROM KYC LEFT JOIN users ON KYC.user_id = users.id LEFT JOIN Identity_proof ON Identity_proof.id=KYC.identity_proof_id ORDER by KYC.id DESC
        `;
    const [result, fields] = await promisePool.query(sql);
    return result;
  };
  getAllkycById = async (user_id) => {
    let sql = `SELECT KYC.id,KYC.user_id,KYC.user_name,KYC.BankStatement,DATE_FORMAT(KYC.dob, '%Y-%m-%d') as dob,KYC.email,KYC.identity_proof_id,KYC.image,KYC.doc_no,KYC.userImage,KYC.Address,KYC.phoneNo,KYC.kyc_status,users.id as userId ,Identity_proof.identity_name as identity_name
        FROM KYC   LEFT JOIN users ON KYC.user_id = users.id LEFT JOIN Identity_proof ON Identity_proof.id=KYC.identity_proof_id  WHERE KYC.user_id ='${user_id}'
        `;

    const [result, fields] = await promisePool.query(sql);
    // console.log(sql, result);
    return result;
  };

  UpdateSuccessKyc = async (id) => {
    let sql = `UPDATE KYC SET kyc_status =2 WHERE id='${id}'`;

    const [result, fields] = await promisePool.query(sql);
    return result;
  };

  rejectKyc = async (id) => {
    let sql = `UPDATE KYC SET kyc_status =3 WHERE id='${id}'`;

    const [result, fields] = await promisePool.query(sql);
    return result;
  };

  getKycDataById = async (id) => {
    let sql = `select * from KYC where user_id='${id}'`
    // console.log('sql:', sql)
    // let sql = `select * from KYC where id='${id}'`;

    const [result, fields] = await promisePool.query(sql);
    return result;

  }

  updateKycData = async (data) => {
    let sql = `UPDATE KYC SET user_id = '${data.user_id}',user_name = '${data.user_name}',dob = '${data.dob}',email= '${data.email}',identity_proof_id = '${data.identity_proof_id}',image = '${data.image}',doc_no = '${data.doc_no}',kyc_status= '1' , Address='${data.Address}',BankStatement='${data.BankStatement}',phoneNo='${data.phoneNo}',userImage='${data.userImage}'WHERE user_id = '${data.user_id}'`;
   
    const [result, fields] = await promisePool.query(sql);
  
    return result;
  };
}

module.exports = new kycModel();
