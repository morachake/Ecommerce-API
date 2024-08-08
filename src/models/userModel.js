const db = require('../config/dbConfig')
const bcrypt = require('bcryptjs');  

const Users ={
    create: async (name,email,password)=>{
        const hashedPassword = await bcrypt.hash(password,12)
        const result = await db.query(
            'INSERT INTO users (name, email, password) VALUES (?,?,?)',
            [name, email, hashedPassword])
        return result.insertId
    },

    findByEmail: async (email) => {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    },

    updatePassword : async (password) => {
        const hashedPassword = await bcrypt.hash(password,12);
        await db.query('UPDATE users SET password = ? WHERE ID = ?',[hashedPassword, id]);
    },

    setResetToken : async (id,token,expires) => {
        await db.query('UPDATE users SET reset_password_token = ?, reset_password_expires = ? WHERE id = ?', [token, expires, id]);
    }, 

    findByResetToken : async (token) => {
        const [rows ] = await db.query(
            'SELECT * FROM users WHERE reset_password_token = ? AND reset_password_expires > NOW()',
            [token]);
            return rows[0]
    }
    
}


module.exports = Users;