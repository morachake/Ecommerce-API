const db = require('../config/dbConfig')
const bycrypt = require('bycryptjs')

const Users ={
    create: async (name,email,password)=>{
        const hashedPassword = await bycrypt.hash(password,12)
        const result = await db.query(
            'INSERT INTO users (name, email, password) VALUES (?,?,?)',
            [name, email, hashedPassword])
        return result.insertId
    },

    findEmailById : async (email) => {
        const [rows ] = await db.query(
            'SELECT * FROM users WHERE email = ?',[email]);
            return rows[0]
    },

    updatePassword : async (password) => {
        const hashedPassword = await bycrypt.hash(password,12);
        await db.query('UPDATE users SET password = ? WHERE ID = ?',[hashedPassword, id]);
    },

    setResetToken : async (id,token,expires) => {
        await db.query('UPDATE users SET reset_password_token = ?, reset_password_expires = ? WHERE id = ?', [token, expires, id]);
    }, 

    findByResetTokes : async (token) => {
        const [rows ] = await db.query(
            'SELECT * FROM users WHERE reset_password_token = ? AND reset_password_expires > NOW()',
            [token]);
            return rows[0]
    }
    
}


module.exports = Users;