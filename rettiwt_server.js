const express = require('express')
const path = require('path')
const db = require('./public/db.js')

const app = express()

// setup static and middleware
app.use(express.static('./public'))
// parse form data
app.use(express.urlencoded({ extended: false}))

// register route - insert new account into database
app.get('/register', (req, res) => {
    res.sendFile(path.resolve(__dirname, './public/register.html'))
})
app.post('/register', (req, res)=> {
    const {username, email, password} = req.body
    var addSql = 'INSERT INTO rettiwtUser(username,pw,email,profile_pic,cover_pic) VALUES(?,?,?,?,?)'
    var addSqlParams = [username, password, email, 'profile.png', 'cover.png']
    db.query(addSql, addSqlParams, function (err, result) {
        if (err) {
            console.log('[INSERT ERROR] - ', err.message)
            return
        }
        console.log(result)
    })
    // db.end()

    res.sendFile(path.resolve(__dirname, './public/homepage.html'))
})


// login route - search in account database
app.get('/login', (req, res) => {
    res.sendFile(path.resolve(__dirname, './public/login.html'))
})
app.get('/login_wrong', (req, res) => {
    res.sendFile(path.resolve(__dirname, './public/login_wrong.html'))
})
app.post('/login', (req, res) => {
    const {username_email, password} = req.body
    var type = 'email'
    if (username_email.indexOf("@") == -1) {
        type = 'username'
    }
    if(username_email && password) {
        var sql
        if (type == 'email') {
            sql = 'SELECT * FROM rettiwtUser WHERE email ="' + username_email + '"'
        } else {
            sql = 'SELECT * FROM rettiwtUser WHERE username ="' + username_email + '"'
        }
        db.query(sql, function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message)
                return
            }
            if (result != null) {
                if (result[0].pw == password) {
                    res.sendFile(path.resolve(__dirname, './public/homepage.html'))
                } else {
                    res.sendFile(path.resolve(__dirname, './public/login_wrong.html'))
                }
            } else {
                res.sendFile(path.resolve(__dirname, './public/login_wrong.html'))
            }
        })
    } else {
        res.sendFile(path.resolve(__dirname, './public/login_wrong.html'))
    }
})

// home page route
app.get('/homepage', (req, res) => {
    res.sendFile(path.resolve(__dirname, './public/homepage.html'))
})

// Not Found
app.all('*', (req, res) => {
    res.status(404).send('Not Found')
})

app.listen(3000, ()=>{
    console.log('server is listening on port 3000...')
})
