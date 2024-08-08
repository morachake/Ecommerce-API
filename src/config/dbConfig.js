const sql = require('mysql2')

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'moracha100',
    database: 'journal'
})

module.exports = pool.promise()