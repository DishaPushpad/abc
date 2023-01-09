const config = require('../config')
const mysql= require('mysql2');
const { password } = require('../config');
const pool = mysql.createPool({host:config.mysqlHost, user:config.user, password:config.password,database:config.database , port:config.mysqlPort });

const promisePool= pool.promise();
 
class userModel {
   
    getUserEmail = async(email)=>{
        let sql = `SELECT * FROM users where email ='${email}'`;
        const[result , fields] = await promisePool.query(sql);
        return result;
    }


     saveUserDetails = async ( data)=>{
        let sql = `INSERT INTO users (first_name , last_name , email, password , image) VALUES ('${data.first_name}','${data.last_name}','${data.email}','${data.password}','${data.image}')`;
        const [result , fields]= await promisePool.query(sql)
        return result;
     }

     updatePassword = async (password,data)=>{
        let sql = `UPDATE users SET password ='${password}' WHERE email='${data.email}'`;
        console.log('sql1111',sql);
        const [ result , fields]=await promisePool.query(sql)
        return result;
     }

     verifyAccount = async (email)=>{
        let sql = `UPDATE users SET  is_email_verify = 1 WHERE email = '${email}'`;
        const [result , fields]=await promisePool.query(sql)
        return result;
      }
      resetPassword = async (hash,email)=>{
        let sql = `UPDATE users SET password ='${hash}' WHERE email='${email}'`;
        console.log('sql:',sql);
        const [ result , fields]=await promisePool.query(sql)
        return result;
     }
     getAllDetail= async()=>{
        let sql = `SELECT * FROM users`
        const[result , fields]=await promisePool.query(sql)
        return result

     }
     FindById=async(id)=>{
        let sql = `SELECT * FROM users WHERE id='${id}'`;
        const[result , fields]=await promisePool.query(sql)
        return result;
     }
     getUserById = async(id)=>{
        let sql = `SELECT * FROM users where id='${id}'`;
        const[result , fields]=await promisePool.query(sql)
        return result;
     }


userUpdateById=async(data,id)=>{
   console.log('data,id:',data,id)
let sql = `UPDATE users SET 
first_name = '${data.first_name}',
last_name='${data.last_name}',
image='${data.image}',
Description='${data.Description}'
WHERE id = '${id}'`;
console.log(sql)
const[result , fields]=await promisePool.query(sql)
return result;
     }
 }


 module.exports= new userModel