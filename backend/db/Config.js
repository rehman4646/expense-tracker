const mysql = require('mysql')

const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "expense_tracker"
})
conn.connect((err)=>{
    if(err){
        console.log("Connection Error", err)
    } else {
        console.log('MySQL connected successfully.')
    }
})
module.exports = conn ;