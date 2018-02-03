module.exports = (app, client, bcrypt) => {
    app.get("/signup", (req, res) =>{             
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

    app.post("/signup", (req, res) => {
        var username = req.body.username
        var password = req.body.password

        var salt = bcrypt.genSalt(10, function(error, salt) {

            bcrypt.hash(password, salt, function(err, hash) {

                // Store hash in the password DB.
                if (err) throw err
                // The query goes here
                client.query(`SELECT * FROM users WHERE username = $1`, [`${username}`], (err, result) => {
                    if (result.rows != 0) {
                        res.render("index", { alert: "Username is already taken" });
                    } else {
                        client.query("INSERT INTO users(username, password) values($1, $2) RETURNING *;", [`${username}`, `${hash}`], (err, result2) => {
                            if (err) throw err

                            else {
                                res.render("index", { alert: "Signup Successful" })
                            }
                        });
                    };
                });
            });
        });
    });
};