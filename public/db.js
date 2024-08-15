// This is the database configurations
// The database will attempt connect when the server calls this module
const mysql = require('mysql')
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'yourdatabasepassword',
    database: 'rettiwt'
})

db.connect(function(error){
	if(error) {
		throw error
	} else {
		console.log('MySQL Database is connected Successfully')
	}
})

module.exports = db
