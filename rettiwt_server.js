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

// const fs = require('fs');

/**************************************************************************************************/

// register route - insert new account into database
app.get('/register', (req, res) => {
    res.sendFile(path.resolve(__dirname, './public/register.html'))
})

// register post request
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    const profilePicPath = '/profile.png';

    // Insert new user into database
    var sql = 'INSERT INTO Account (username, password, email, profile_pic) VALUES (?, ?, ?, ?)';
    var values = [username, password, email, profilePicPath];

    db.query(sql, values, function (err, result) {
        if (err) {
        console.log('[INSERT ERROR] - ', err.message);
        return;
        }
        console.log('Inserted new entry to database');
        res.redirect('/login');
    });
});

/**************************************************************************************************/

// login page
app.get('/login', (req, res) => {
    res.render('login', {error: null});
})

// login page post request
app.post('/login', (req, res) => {
    const {username_email, password} = req.body
    let type = username_email.includes("@") ? 'email' : 'username';
    
    // search for a match in database
    if(username_email && password) {
        let sql
        let admin = 'false'
        if (type === 'email') {
            sql = 'SELECT * FROM Account WHERE email = ?'
            // if (username_email == 'wong@gmail.com') admin = 'true'
        } else {
            sql = 'SELECT * FROM Account WHERE username = ?'
            // if (username_email === 'Chris Wong') admin = 'true'
        }
        db.query(sql, username_email, function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message)
                return res.send('<script>alert("Database error. Please try again."); window.location.href="/login";</script>');
            }
            if (result.length > 0) {
                if (result[0].password === password) {
                    if (admin == 'true') {
                        res.redirect('/admin/')
                    } else {
                        res.redirect('/homepage/' + result[0].user_id)
                    }
                } else {
                    res.render('login', { error: 'true' });
                }
            } else {
                res.render('login', { error: 'true' });
            }
        })
    } else {
        res.render('login', { error: 'true' });
    }
})

/**************************************************************************************************/

// app.get('/admin', (req, res) => {
//     res.render('admin')
// }) 

const getUserPosts = (id, callback) => {
    const sql = `
        SELECT 
            Post.*, 
            Account.*, 
            (SELECT COUNT(*) FROM Following WHERE following_user_id = ?) AS followers, 
            (SELECT COUNT(*) FROM Following WHERE user_id = ?) AS following 
        FROM 
            Account 
        LEFT JOIN 
            Post ON Account.user_id = Post.user_id 
        WHERE 
            Account.user_id = ?`;

    db.query(sql, [id, id, id], (err, result) => {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return callback(err);
        }
        if (result.length > 0) {
            const user = result[0];
            const posts = result.map(post => ({
                ...post,
                post_time: formatDate(post.post_time)
            })).filter(post => post.post_id !== null); // Exclude rows without posts
            
            callback(null, { user, posts, followers: user.followers, following: user.following });
        } else {
            callback(null, null); // User not found
        }
    });
};

/**************************************************************************************************/

// Render the profile page for a given user ID
app.get('/profile/:id(\\d+)', (req, res) => {
    const id = req.params.id;

    getUserPosts(id, (err, data) => {
        if (err) {
            return res.status(500).send('Internal server error');
        }
        if (!data) {
            return res.status(404).send('User not found');
        }
        const { user, posts, followers, following } = data;
        res.render('profile', { user, posts, id, followers, following });
    });
});

// Endpoint to fetch post info
app.post('/api/posts/getposts/:id', (req, res) => {
    const id = req.params.id;

    getUserPosts(id, (err, data) => {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return res.status(500).send('Internal server error');
        }
        if (!data) {
            return res.status(404).send('User not found');
        }
        const { posts } = data; // Only send posts back
        res.json(posts);
    });
});

// Endpoint to handle edit requests
app.post('/api/posts/create', (req, res) => {
    const { id, description } = req.body;
    const post_time = new Date();

    var sql = null;
    if (typeof file !== 'undefined') {
        sql = 'INSERT INTO Post (image_filename, description, post_time, user_id,) VALUES (?, ?, ?, ?);'
        values = [file, description, post_time, id];
    } else {
        sql = 'INSERT INTO Post (description, post_time, user_id) VALUES (?, ?, ?);'
        values = [description, post_time, id]
    }

    db.query(sql, values, function (err, results) {
        if (err) {
        console.log('[INSERT ERROR] - ', err.message);
        return;
        }
        res.json({ message: 'Inserted new entry to Post database successfully!', results });
    });
});

// Endpoint to handle edit requests
app.post('/api/posts/edit', (req, res) => {
    const { id, description } = req.body;

    const query = 'UPDATE Post SET description = ? WHERE post_id = ?';
    db.query(query, [description, id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Post updated successfully!', results });
    });
});

// Endpoint to handle delete requests
app.delete('/api/posts/delete/:id', (req, res) => {
    const postId = req.params.id;

    const query = 'DELETE FROM Post WHERE post_id = ?';
    db.query(query, [postId], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Post deleted successfully!', results });
    });
});

/**************************************************************************************************/

// home page route
app.get('/homepage/:id(\\d+)', (req, res) => {
    const id = req.params.id
    
    var sql = `SELECT * FROM Post 
        INNER JOIN Following ON Following.following_user_id = Post.user_id
        WHERE Following.user_id = ?`; 
    db.query(sql, id, function (err, post_result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message); return;
        }
        var sql = `SELECT * FROM Account 
            INNER JOIN Post ON Account.user_id = Post.user_id
            INNER JOIN Following ON Following.following_user_id = Post.user_id
            WHERE Following.user_id = ?`; 
        db.query(sql, id, function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message); return;
            }
            res.render('homepage', {result, id})
        });
    });
})

/**************************************************************************************************/

// Search page route
app.get('/search/:id(\\d+)', (req, res) => {
    const id = req.params.id
    const username = req.query.username + '%'
    var sql = 'SELECT * FROM Account WHERE username LIKE ?';
    db.query(sql, username, function (err, result) { 
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return; 
        }
        const newresult = result.filter(function checkuser(result) {
            if (result.user_id != id) {
                return result.user_id
            }
        })
        res.render('search', {newresult, id})
    });
})

/**************************************************************************************************/

// other profile pages
app.get('/other_profile/:targetid(\\d+)/:id(\\d+)', (req,res) => {
    const targetid = req.params.targetid
    const id = req.params.id
    var sql = 'SELECT * FROM Account WHERE user_id = ?';
    db.query(sql, targetid, function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message); return;
        }
        if (result.length > 0) {
            const targetuser = result[0]
            var sql = 'SELECT * FROM Post WHERE user_id = ?'
            db.query(sql, targetid, function (err, post_result) {
                if (err) {
                    console.log('[SELECT ERROR] - ', err.message)
                    return
                }
                var temp = []
                if (typeof post_result[0] !== 'undefined') {
                    temp = post_result
                }
                const posts = temp.map(post => {
                    return {
                        ...post,
                        post_time: formatDate(post.post_time)
                    };
                });
                var follow = false
                var followers = 0
                var sql = 'SELECT * FROM Following WHERE following_user_id = ?'
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
                    var sql = 'SELECT * FROM Following WHERE user_id = ?'
                    db.query(sql, targetid, function (err, result) {
                        if (err) {
                            console.log('[SELECT ERROR] - ', err.message)
                            return
                        }
                        following = result.length
                        var likes = []
                        var liked = []
                        for (let i = 0; i < posts.length; i++) {
                            var sql = 'SELECT * FROM Likes WHERE post_id = ?'
                            db.query(sql, posts[i].post_id, function (err, result) {
                                if (err) {
                                    console.log('[SELECT ERROR] - ', err.message)
                                    return
                                }
                                likes.push(result.length)
                                var likedBefore = 'false'
                                for (let j = 0; j < result.length; j++) {
                                    if (result[j].follower_id == id) {
                                        likedBefore = 'true'
                                        break
                                    }
                                }
                                liked.push(likedBefore)
                                if (likes.length == posts.length) {
                                    res.render('other_profile', { targetuser, posts, id, followers, following, follow, likes, liked})
                                }
                            })
                        }
                    })
                })
            })
        } else {
            res.status(404).send('User not found')
        }
    });
})
// other profile page post request - update follow database
app.post('/update-follow/:targetid(\\d+)/:id(\\d+)', (req, res) => {
    const {follow} = req.body
    const targetid = req.params.targetid
    const id = req.params.id

    if (follow == 'follow') {
        var sql = 'INSERT INTO Following(user_id,following_user_id) VALUES(?,?)';
        var values = [id, targetid]; 
        db.query(sql, values, function (err, result) {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                return; 
            }
        });
    } else if (follow == 'unfollow') {
        var sql = 'DELETE FROM Following WHERE following_user_id = ? AND user_id = ?';
        var values = [targetid, id]
        db.query(sql, values, function (err, result) { 
            if (err) {
                console.log('[DELETE ERROR] - ', err.message);
                return;
            }
        });
    }

    var followers = 0
    var sql = 'SELECT * FROM Following WHERE following_user_id = ?'
    db.query(sql, targetid, function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message)
            return
        }
        followers = result.length
        var following = 0
        var sql = 'SELECT * FROM Following WHERE user_id = ?'
        db.query(sql, targetid, function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message)
                return
            }
            following = result.length
            res.json({
                following: following,
                followers: followers
            });
        })
    })
});
// other profile page post request - update like database
app.post('/update-like/:id(\\d+)', (req, res) => {
    const {action, post_id} = req.body
    const id = req.params.id

    if (action == 'like') {
        var sql = 'INSERT INTO Likes (post_id,user_id) VALUES (?,?)'
        var values = [post_id, id]
        db.query(sql, values, function (err, result) {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message)
                return
            }
            console.log('user liked a post')
        })
    } else if (action == 'unlike') {
        var sql = 'DELETE FROM Likes WHERE post_id = ? AND user_id = ?'
        var values = [post_id, id]
        db.query(sql, values, function (err, result) {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message)
                return
            }
            console.log('user unliked a post')
        })
    }

    var sql = 'SELECT * FROM Likes WHERE post_id = ?'
    db.query(sql, post_id, function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message)
            return
        }
        res.json({
            likes: result.length
        })
    })
})

/**************************************************************************************************/

// setting page route
app.get('/settingpage/:id(\\d+)', (req, res) => {
    const id = req.params.id
    var sql = 'SELECT * FROM Account WHERE user_id = ?'
    db.query(sql, id, function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message); 
            return;
        }
        const user = result[0]
        res.render('settingpage', {user})
    })
})

// setting page post request
app.post('/settingpage/:id(\\d+)', (req, res) => {
    const id = req.params.id
    console.log(req.body)
    const password = req.body.password
    const bio = req.body.bio
    var sql
    var values
    if (typeof password !== 'undefined' && typeof bio !== 'undefined') {
        sql = 'UPDATE Account SET bio = ?, password = ? WHERE user_id = ?';
        values = [bio, password, id]
    } else if (typeof password !== 'undefined') {
        sql = 'UPDATE Account SET password = ? WHERE user_id = ?';
        var values = [password, id];
    } else if (typeof bio !== 'undefined'){
        sql = 'UPDATE Account SET bio = ? WHERE user_id = ?';
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

/**************************************************************************************************/

// Not Found
app.all('*', (req, res) => {
  res.status(404).send('Not Found')
})

// Show all user objects
var sql = 'SELECT * FROM Account'
db.query(sql, function (err, result) {
    if (err) {
        console.log('[SELECT ERROR] - ', err.message)
        return
    }
    console.log(result)
})


// start the server
app.listen(3000, () => {
  console.log('Server is listening on port 3000...')
})

// format post_time function
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}
