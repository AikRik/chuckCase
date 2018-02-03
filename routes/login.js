"use strict"
module.exports = (app, client, bcrypt) => {
    app.get("/login", (req, res) =>{             
        client.query(`SELECT * FROM favorites WHERE user_id = $1 ORDER by ID DESC`, [req.session.user.id], (err, result) => {
            if (err) throw err

            var favoriteJokes = []

            for (var i = 0; i < result.rows.length; i++) {
                var jokesResult = result.rows[i]
                favoriteJokes.push(jokesResult)
            };
            res.render("index", {
                user: req.session.user.username,
                favoriteJokes: favoriteJokes
            })
        })
})

    app.post("/login", (req, res) => {

        var password = req.body.password

        client.query(`SELECT * FROM users WHERE username = $1`, [`${req.body.username}`], (err, response) => {
            if (err) throw err

            else if (response.rows.length > 0) {

                var hash = response.rows[0].password
                //check the password
                bcrypt.compare(password, hash, function(err, result) {
                    if (err) throw err

                    else if (response.rows[0].username === req.body.username && result === true) {
                        req.session.user = { id: response.rows[0].id, username: response.rows[0].username };
                        var user_id = req.session.user.id
                        //query all jokes that user has as favorite from favorites table
                        client.query(`SELECT * FROM favorites WHERE user_id = $1 ORDER by ID DESC`, [user_id], (err, result) => {

                            if (err) throw err

                            var favoriteJokes = []

                            for (var i = 0; i < result.rows.length; i++) {
                                var jokesResult = result.rows[i]
                                favoriteJokes.push(jokesResult)
                            };
                            res.render("index", {
                                favoriteJokes: favoriteJokes,
                                user: req.session.user.username
                            })
                        });
                    };
                });
            } else {
                res.render("index")
            };
        });
    });
};