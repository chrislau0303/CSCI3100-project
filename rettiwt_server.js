const express = require('express')
const path = require('path')
const db = require('./public/db.js')
const app = express()
const bodyParser = require('body-parser');

app.use(bodyParser.json());

// Serve static files from the public directory
app.use(express.static('./public'))

// parse form data
app.use(express.urlencoded({ extended: false}))

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Serve static files from the public directory
app.use(express.static('public'));

// register route - insert new account into database
app.get('/register', (req, res) => {
    res.sendFile(path.resolve(__dirname, './public/register.html'))
})

const fs = require('fs');

app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    const profilePicPath = '/profile.png';
    const coverPicPath = '/cover.png';

    var sql = 'INSERT INTO rettiwtUser (username, pw, email, profile_pic, cover_pic) VALUES (?, ?, ?, ?, ?)';
    var values = [username, password, email, profilePicPath, coverPicPath];

    db.query(sql, values, function (err, result) {
        if (err) {
        console.log('[INSERT ERROR] - ', err.message);
        return;
        }
        console.log('Inserted new entry to database');
        res.redirect('/login');
    });

});

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
    if (username_email.indexOf("@") === -1) {
        type = 'username'
    }
    
    if(username_email && password) {
        var sql
        var admin = 'false'
        if (type === 'email') {
            sql = 'SELECT * FROM rettiwtUser WHERE email = ?'
            if (username_email == 'wong@gmail.com') admin = 'true'
        } else {
            sql = 'SELECT * FROM rettiwtUser WHERE username = ?'
            if (username_email === 'Chris Wong') admin = 'true'
        }
        db.query(sql, username_email, function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message)
                return
            }
            if (typeof result[0] !== 'undefined') {
                if (result[0].pw === password) {
                    if (admin == 'true') {
                        res.redirect('/admin/')
                    } else {
                        res.redirect('/profile/' + result[0].user_id)
                    }
                } else {
                    res.redirect('/login_wrong.html')
                }
            } else {
                res.redirect('/login_wrong.html')
            }
        })
    } else {
        res.redirect('/login_wrong.html')
    }
})
app.get('/admin', (req, res) => {
    res.render('admin')
}) 

// Render the profile page for a given user ID
app.get('/profile/:id(\\d+)', (req, res) => {
    const id = req.params.id;
    var sql = 'SELECT * FROM rettiwtUser WHERE user_id = ?'
    db.query(sql, id, function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message)
            return
        }
        if (typeof result[0] !== 'undefined') {
            const user = result[0]
            var sql = 'SELECT * FROM post WHERE user_id = ?'
            db.query(sql, id, function (err, post_result) {
                if (err) {
                    console.log('[SELECT ERROR] - ', err.message)
                    return
                }
                var followers = 0
                var sql = 'SELECT * FROM followers WHERE user_id = ?'
                db.query(sql, id, function (err, result) {
                    if (err) {
                        console.log('[SELECT ERROR] - ', err.message)
                        return
                    }
                    followers = result.length
                    var following = 0
                    var sql = 'SELECT * FROM followers WHERE follower_id = ?'
                    db.query(sql, id, function (err, result) {
                        if (err) {
                            console.log('[SELECT ERROR] - ', err.message)
                            return
                        }
                        following = result.length
                        if (typeof post_result[0] !== 'undefined') {
                            const posts = post_result
                            res.render('profile', { user, posts, id, followers, following})
                        } else {
                            res.render('profile', { user, posts: [], id, followers, following})
                        }
                    })
                })
            })
        } else {
            res.status(404).send('User not found')
        }
    })
});
app.post('/profile/:id(\\d+)', (req,res) => {
    const type = req.body.method
    const id = req.params.id
    if (type == 'POST') {
        const {content, file, hide_post} = req.body
        const time = new Date();
        var hide = null
        if (typeof hide_post !== 'undefined') {
            hide = 1
        }

        var sql
        var values
        if (typeof file !== 'undefined') {
            sql = 'INSERT INTO post (media, post_des, post_time, user_id, hide_post) VALUES (?, ?, ?, ?, ?);'
            values = [file, content, time, id, hide];
        } else {
            sql = 'INSERT INTO post (post_des, post_time, user_id, hide_post) VALUES (?, ?, ?, ?);'
            values = [content, time, id, hide]
        }

        db.query(sql, values, function (err, result) {
            if (err) {
            console.log('[INSERT ERROR] - ', err.message);
            return;
            }
            console.log('Inserted new entry to post database');
        });

    } else if (type == 'PUT') {
        const postID = req.body.postID
        const {content, hide_post} = req.body
        var hide = 'false'
        if (typeof hide_post !== 'undefined') {
            hide = 'true'
        }
        var sql= 'UPDATE post SET post_des = ?, hide_post = ? WHERE post_id = ?';
        var values = [content, hide_post, postID];
        db.query(sql, values, function (err, result) {
            if (err) {
                console.log('[UPDATE ERROR] - ', err.message);
                return;
            }
            console.log('Editted entry from post database'); 
        });
    } else if (type == 'DELETE') {
        const postID = req.body.postID
        var sql = 'DELETE FROM post WHERE post_id = ?';
        db.query(sql, postID, function (err, result) { 
            if (err) {
                console.log('[DELETE ERROR] - ', err.message);
                return; 
            }
            console.log('Deleted entry from post database');
        });
    }
    res.redirect('/profile/' + id)
})

// home page route
app.get('/homepage/:id(\\d+)', (req, res) => {
    const id = req.params.id
    
    var sql = 'SELECT * FROM post a INNER JOIN followers b ON b.follower_id = ? AND b.user_ID = a.user_ID'; 
    db.query(sql, id, function (err, post_result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message); return;
        }
        var sql = 'SELECT * FROM rettiwtUser a INNER JOIN post b INNER JOIN followers c ON c.follower_id = ? AND c.user_ID = b.user_ID AND a.user_id = b.user_id'; 
        db.query(sql, id, function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message); return;
            }
            // console.log(result)
            res.render('homepage', {result, id})
        });
        //res.render('homepage', {post_result, id})
    });
    // res.render('homepage', {post_result, id})
})

// Search page route
app.get('/search/:id(\\d+)', (req, res) => {
    const id = req.params.id
    const username = req.query.username + '%'
    var sql = 'SELECT * FROM rettiwtUser WHERE username LIKE ?';
    db.query(sql, username, function (err, result) { 
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return; 
        }
        //console.log(result);
        const newresult = result.filter(function checkuser(result) {
            if (result.user_id != id) {
                return result.user_id
            }
        })
        //console.log(newresult)
        res.render('search', {newresult, id})
    });
})

// other profile
app.get('/other_profile/:targetid(\\d+)/:id(\\d+)', (req,res) => {
    const targetid = req.params.targetid
    const id = req.params.id
    var sql = 'SELECT * FROM rettiwtUser WHERE user_id = ?';
    db.query(sql, targetid, function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message); return;
        }
        //console.log(result)
        if (typeof result[0] !== 'undefined') {
            const targetuser = result[0]
            // console.log(user)
            var sql = 'SELECT * FROM post WHERE user_id = ?'
            db.query(sql, targetid, function (err, post_result) {
                if (err) {
                    console.log('[SELECT ERROR] - ', err.message)
                    return
                }
                var follow = false
                var followers = 0
                var sql = 'SELECT * FROM followers WHERE user_id = ?'
                db.query(sql, targetid, function (err, result) {
                    if (err) {
                        console.log('[SELECT ERROR] - ', err.message)
                        return
                    }
                    followers = result.length
                    for (let i = 0; i < result.length; i++) {
                        if (result[i].follower_id == id) {
                            follow = true
                            break
                        }
                    }
                    var following = 0
                    var sql = 'SELECT * FROM followers WHERE follower_id = ?'
                    db.query(sql, targetid, function (err, result) {
                        if (err) {
                            console.log('[SELECT ERROR] - ', err.message)
                            return
                        }
                        following = result.length
                        if (typeof post_result[0] !== 'undefined') {
                            const posts = post_result
                            // console.log(posts)
                            res.render('other_profile', { targetuser, posts, id, followers, following, follow})
                        } else {
                            res.render('other_profile', { targetuser, posts: [], id, followers, following, follow})
                        }
                    })
                })
            })
        } else {
            res.status(404).send('User not found')
        }
    });
})
app.post('/update/:targetid(\\d+)/:id(\\d+)', (req, res) => {
    const {follow} = req.body
    const targetid = req.params.targetid
    const id = req.params.id

    if (follow == 'follow') {
        var sql = 'INSERT INTO followers(user_id,follower_id) VALUES(?,?)';
        var values = [targetid, id]; 
        db.query(sql, values, function (err, result) {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                return; 
            }
        });
    } else if (follow == 'unfollow') {
        var sql = 'DELETE FROM followers WHERE user_id = ? AND follower_id = ?';
        var values = [targetid, id]
        db.query(sql, values, function (err, result) { 
            if (err) {
                console.log('[DELETE ERROR] - ', err.message);
                return;
            }
        });
    }

    var followers = 0
    var sql = 'SELECT * FROM followers WHERE user_id = ?'
    db.query(sql, targetid, function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message)
            return
        }
        followers = result.length
        var following = 0
        var sql = 'SELECT * FROM followers WHERE follower_id = ?'
        db.query(sql, targetid, function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message)
                return
            }
            following = result.length
            console.log(following)
            console.log(followers)
            res.json({
                following: following,
                followers: followers
            });
        })
    })
});


app.get('/settingpage/:id(\\d+)', (req, res) => {
    const id = req.params.id
    var sql = 'SELECT * FROM rettiwtUser WHERE user_id = ?'
    db.query(sql, id, function (err, result) {
        if (err) {
        console.log('[SELECT ERROR] - ', err.message); return;
        }
        const user = result[0]
        res.render('settingpage', {user})
    })
})
app.post('/settingpage/:id(\\d+)', (req, res) => {
    const id = req.params.id
    console.log(req.body)
    const pw = req.body.pw
    const bio = req.body.bio
    var sql
    var values
    if (typeof pw !== 'undefined' && typeof bio !== 'undefined') {
        sql = 'UPDATE rettiwtUser SET bio = ?, pw = ? WHERE user_id = ?';
        values = [bio, pw, id]
    } else if (typeof pw !== 'undefined') {
        sql = 'UPDATE rettiwtUser SET pw = ? WHERE user_id = ?';
        var values = [pw, id];
    } else if (typeof bio !== 'undefined'){
        sql = 'UPDATE rettiwtUser SET bio = ? WHERE user_id = ?';
        var values = [bio, id];
    }
    console.log(sql)
    db.query(sql, values, function (err, result) {
        if (err) {
            console.log('[UPDATE ERROR] - ', err.message);
            return; 
        }
        console.log('updated user bio/password')
    });
    res.json({ok: 'ok'})
})

// Not Found
app.all('*', (req, res) => {
  res.status(404).send('Not Found')
})

// Show all user objects
var sql = 'SELECT * FROM rettiwtUser'
db.query(sql, function (err, result) {
    if (err) {
        console.log('[SELECT ERROR] - ', err.message)
        return
    }
    console.log(result)
})

// var sql
// var values
// sql = 'INSERT INTO post (post_des, post_time, user_id, hide_post) VALUES (?, ?, ?, ?);'
// values = ['content', '1000-01-01 00:00:00', 7, true]

// db.query(sql, values, function (err, result) {
//     if (err) {
//     console.log('[INSERT ERROR] - ', err.message);
//     return;
//     }
//     console.log('Inserted new entry to post database');
// });

// sql = 'DELETE FROM ';
// db.query(sql, function (err, result) {
//     if (err) {
//         console.log('[DELETE ERROR] - ', err.message);
//         return;
//     } else {
//         console.log('deleted')
//     }
// });


// start the server
app.listen(3000, () => {
  console.log('Server is listening on port 3000...')
})
