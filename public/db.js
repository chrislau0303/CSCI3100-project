const mysql = require('mysql')
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Abcd0303',
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