module.exports = (app, client, bcrypt) => {
    app.get("/signup", (req, res) => res.render("signup"))

    app.post("/signup", (req, res) => {
        var username = req.body.username
        var password = req.body.password

        var salt = bcrypt.genSalt(10, function(error, salt) {

            bcrypt.hash(password, salt, function(err, hash) {

                // Store hash in the password DB.
                if (err) throw err
                // The query goes here
                client.query(`SELECT * FROM users WHERE username = $1`,[`${username}`], (err, result) => {
                    if (result.rows != 0) {
                        res.render("index", { error: "Username is already taken" });
                    } else {
                        client.query("INSERT INTO users(username, password) values($1, $2) RETURNING *;", [`${username}`, `${hash}`], (err, result2) => {
                        	console.log(username, hash, "check")
                            if (err) throw err
                            
                            else{
                            	console.log("success")
                            	res.render("index")}
                        });
                    };
                });
            });
        });
    });
};